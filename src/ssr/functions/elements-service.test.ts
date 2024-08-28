import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { SsrResponse } from "./fetch-elements";
import { getDecoratorElements } from "./elements-service";
import { getCsrElements } from "../../common/csr-elements";

const validResponse = {
    headAssets: '<link type="text/css" rel="stylesheet" href="main.css">',
    header: '<header id="decorator-header">Header HTML goes here</header>',
    footer: '<div id="decorator-footer">Footer HTML goes here</div>',
    scripts: '<script src="main.js" type="module"></script>',
    versionId: "asdf",
} satisfies SsrResponse;

const invalidResponse = { foo: "bar" };

describe("Get decorator elements", () => {
    enableFetchMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("Should return SSR elements on a valid response", async () => {
        fetchMock.mockResponse(JSON.stringify(validResponse));

        const elements = await getDecoratorElements({ env: "prod", noCache: true });

        expect(elements.DECORATOR_HEAD_ASSETS).toContain(validResponse.headAssets);
        expect(elements.DECORATOR_HEADER).toContain(validResponse.header);
        expect(elements.DECORATOR_FOOTER).toContain(validResponse.footer);
        expect(elements.DECORATOR_SCRIPTS).toContain(validResponse.scripts);
    });

    test("Should return cached SSR elements on an invalid response", async () => {
        fetchMock.mockResponse(JSON.stringify(validResponse));
        await getDecoratorElements({ env: "prod" });

        fetchMock.mockResponse(JSON.stringify(invalidResponse));
        const elements = await getDecoratorElements({ env: "prod" });

        expect(elements.DECORATOR_HEAD_ASSETS).toContain(validResponse.headAssets);
        expect(elements.DECORATOR_HEADER).toContain(validResponse.header);
        expect(elements.DECORATOR_FOOTER).toContain(validResponse.footer);
        expect(elements.DECORATOR_SCRIPTS).toContain(validResponse.scripts);
    });

    test("Should return CSR elements from an invalid response if not cached", async () => {
        fetchMock.mockResponse(JSON.stringify(invalidResponse));

        const elements = await getDecoratorElements({ env: "prod", noCache: true });
        const csrElements = getCsrElements({ env: "prod" });

        expect(elements.DECORATOR_HEAD_ASSETS).toContain(csrElements.styles);
        expect(elements.DECORATOR_HEADER).toContain(csrElements.header);
        expect(elements.DECORATOR_FOOTER).toContain(csrElements.footer);
        expect(elements.DECORATOR_SCRIPTS).toContain(csrElements.scripts);
    });
});