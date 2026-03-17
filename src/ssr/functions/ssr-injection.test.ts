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

        expect(headAssetsPos).toBeGreaterThanOrEqual(0);
        expect(headClosePos).toBeGreaterThanOrEqual(0);
        expect(bodyOpenPos).toBeGreaterThanOrEqual(0);
        expect(headerPos).toBeGreaterThanOrEqual(0);
        expect(pageContentPos).toBeGreaterThanOrEqual(0);
        expect(footerPos).toBeGreaterThanOrEqual(0);
        expect(scriptsPos).toBeGreaterThanOrEqual(0);
        expect(bodyClosePos).toBeGreaterThanOrEqual(0);

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

    test("Should be case-insensitive for closing tags", async () => {
        const upperCaseHtml = baseHtml.replace("</head>", "</HEAD>").replace("</body>", "</BODY>");
        fsMock({ "app/index.html": upperCaseHtml });

        const html = await injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" });

        expect(html).toContain(response.headAssets);
        expect(html).toContain(response.header);
        expect(html).toContain(response.footer);
        expect(html).toContain(response.scripts);
    });

    test("Should handle whitespace inside closing tags", async () => {
        const spacedHtml = baseHtml.replace("</head>", "</head >").replace("</body>", "</body >");
        fsMock({ "app/index.html": spacedHtml });

        const html = await injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" });

        expect(html).toContain(response.headAssets);
        expect(html).toContain(response.footer);
    });

    test("Should handle special regex replacement characters in injected content", async () => {
        fetchMock.mockResponse(JSON.stringify({
            ...response,
            headAssets: '<script>const x = $& || 0;</script>',
        }));
        fsMock({ "app/index.html": baseHtml });

        const html = await injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" });

        expect(html).toContain('<script>const x = $& || 0;</script>');
    });

    test("Should throw if </head> is missing", async () => {
        const brokenHtml = baseHtml.replace("</head>", "");
        fsMock({ "app/index.html": brokenHtml });

        await expect(injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" }))
            .rejects.toThrow("Could not find </head> in HTML template");
    });

    test("Should throw if <body> is missing", async () => {
        const brokenHtml = baseHtml.replace("<body>", "").replace("</body>", "");
        fsMock({ "app/index.html": brokenHtml });

        await expect(injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" }))
            .rejects.toThrow("Could not find <body> in HTML template");
    });

    test("Should throw if </body> is missing", async () => {
        const brokenHtml = baseHtml.replace("</body>", "");
        fsMock({ "app/index.html": brokenHtml });

        await expect(injectDecoratorServerSide({ filePath: "app/index.html", env: "prod" }))
            .rejects.toThrow("Could not find </body> in HTML template");
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
