import fsMock from "mock-fs";
import { SsrResponse } from "./fetch-decorator-elements";
import { JSDOM } from "jsdom";
import { injectDecoratorServerSideDocument } from "./ssr-document-injection";
import { injectDecoratorServerSide } from "./ssr-file-injection";
import { clearDecoratorElementsState } from "./decorator-elements-service";

const response = {
    headAssets: '<link type="text/css" rel="stylesheet" href="main.css">',
    header: '<header id="decorator-header">Header HTML goes here</header>',
    footer: '<div id="decorator-footer">Footer HTML goes here</div>',
    scripts: '<script src="main.js" type="module"></script>',
    versionId: "asdf",
} satisfies SsrResponse;

const baseHtml =
    "<!DOCTYPE html>" +
    '<html lang="en">' +
    "  <head>" +
    '    <meta charset="utf-8">' +
    "    <title>title</title>" +
    "  </head>" +
    "  <body>" +
    "    <!-- page content -->" +
    "  </body>" +
    "</html>";

describe("SSR injection", () => {

    beforeEach(() => {
        clearDecoratorElementsState();
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify(response));
    });

    afterEach(() => {
        fsMock.restore();
    });

    test("Should inject decorator into file", async () => {
        fsMock({
            "app/index.html": baseHtml,
        });

        const htmlWithDecorator = await injectDecoratorServerSide({
            filePath: "app/index.html",
            env: "prod",
        });

        expect(htmlWithDecorator).toContain("<!-- page content -->");
        expect(htmlWithDecorator).toContain(response.headAssets);
        expect(htmlWithDecorator).toContain(response.header);
        expect(htmlWithDecorator).toContain(response.footer);
        expect(htmlWithDecorator).toContain(response.scripts);
        expect(htmlWithDecorator).toContain("<!DOCTYPE html>");
    });

    test("Should inject elements in correct positions", async () => {
        fsMock({ "app/index.html": baseHtml });

        const html = await injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" });

        const headAssetsPos = html.indexOf(response.headAssets);
        const headClosePos = html.indexOf("</head>");
        const bodyOpenPos = html.indexOf("<body>");
        const headerPos = html.indexOf(response.header);
        const pageContentPos = html.indexOf("<!-- page content -->");
        const footerPos = html.indexOf(response.footer);
        const scriptsPos = html.indexOf(response.scripts);
        const bodyClosePos = html.indexOf("</body>");

        // head assets injected before </head>
        expect(headAssetsPos).toBeLessThan(headClosePos);
        // header injected immediately after <body>
        expect(bodyOpenPos).toBeLessThan(headerPos);
        expect(headerPos).toBeLessThan(pageContentPos);
        // footer and scripts injected before </body>, footer first
        expect(pageContentPos).toBeLessThan(footerPos);
        expect(footerPos).toBeLessThan(scriptsPos);
        expect(scriptsPos).toBeLessThan(bodyClosePos);
    });

    test("Should handle body tag with attributes", async () => {
        const htmlWithBodyAttrs = baseHtml.replace("<body>", '<body class="my-app" data-theme="dark">');
        fsMock({ "app/index.html": htmlWithBodyAttrs });

        const html = await injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" });

        expect(html).toContain('<body class="my-app" data-theme="dark">');
        expect(html.indexOf(response.header)).toBeGreaterThan(html.indexOf('<body class="my-app" data-theme="dark">'));
    });

    test("Should inject decorator into document", async () => {
        const dom = new JSDOM(baseHtml);

        const document = await injectDecoratorServerSideDocument({
            document: dom.window.document,
            env: "prod",
        });

        expect(document).toBe(dom.window.document);
        expect(document.body.outerHTML).toContain("<!-- page content -->");
        expect(document.head.outerHTML).toContain(response.headAssets);
        expect(document.body.outerHTML).toContain(response.header);
        expect(document.body.outerHTML).toContain(response.footer);
        expect(document.body.outerHTML).toContain(response.scripts);
    });
});
