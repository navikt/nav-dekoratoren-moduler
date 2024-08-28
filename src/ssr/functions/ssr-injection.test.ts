import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import fsMock from "mock-fs";
import { SsrResponse } from "./fetch-elements";
import { JSDOM } from "jsdom";
import { injectDecoratorServerSide, injectDecoratorServerSideDocument } from "./ssr-injection";

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
    enableFetchMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify(response));
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
