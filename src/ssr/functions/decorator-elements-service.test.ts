import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { SsrResponse } from "./fetch-decorator-elements";
import { getDecoratorElements } from "./decorator-elements-service";
import { getCsrElements } from "../../common/csr-elements";
import { addDecoratorUpdateListener } from "./decorator-version-watcher";

const validResponse = {
    headAssets: '<link type="text/css" rel="stylesheet" href="main.css">',
    header: '<header id="decorator-header">Header HTML goes here</header>',
    footer: '<div id="decorator-footer">Footer HTML goes here</div>',
    scripts: '<script src="main.js" type="module"></script>',
    versionId: "version1",
} satisfies SsrResponse;

const validResponseNew = {
    ...validResponse,
    header: '<header id="decorator-header">New header html!</header>',
    versionId: "version2",
} satisfies SsrResponse;

const invalidResponse = { foo: "bar" };

describe("Get decorator elements", () => {
    enableFetchMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        jest.useRealTimers();
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

    test("Should not fetch again if recently cached", async () => {
        fetchMock.mockResponse(async () => {
            return JSON.stringify(validResponse);
        });

        await getDecoratorElements({ env: "prod" });
        await getDecoratorElements({ env: "prod" });

        const numSsrCalls = fetchMock.mock.calls
            .flat()
            .filter((url) => typeof url === "string" && url.endsWith("/ssr")).length;

        expect(numSsrCalls).toEqual(1);
    });

    test("Should not return stale version after new version is available", (done) => {
        const newVersionCallback = jest.fn(async () => {
            const newVersionRes = await getDecoratorElements({ env: "prod" });

            expect(newVersionRes.DECORATOR_HEADER).toEqual(validResponseNew.header);
            done();
        });

        jest.useFakeTimers();
        fetchMock.mockResponse(async () => JSON.stringify(validResponse));

        getDecoratorElements({ env: "prod" }).then(() => {
            fetchMock.mockResponse(async (req) => {
                return JSON.stringify(
                    req.url.endsWith("/api/version")
                        ? {
                              latestVersion: "version2",
                          }
                        : validResponseNew,
                );
            });

            addDecoratorUpdateListener({ env: "prod" }, newVersionCallback);

            jest.runOnlyPendingTimers();
        });
    });
});
