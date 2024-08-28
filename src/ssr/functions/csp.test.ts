import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { buildCspHeader } from "./csp";

describe("CSP header builder function", () => {
    enableFetchMocks();

    test("Should not include duplicate directives from decorator and app", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ "default-src": ["foo.bar"] }));

        const cspHeader = await buildCspHeader(
            {
                "default-src": ["foo.bar"],
            },
            { env: "prod" },
        );

        expect(cspHeader).toEqual("default-src foo.bar;");
    });

    test("Should include decorator-specific directive", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ "default-src": ["from.decorator"] }));

        const cspHeader = await buildCspHeader(
            {
                "default-src": ["from.app"],
            },
            { env: "prod" },
        );

        expect(cspHeader).toContain("from.decorator");
    });

    test("Should include app-specific directive", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ "default-src": ["from.decorator"] }));

        const cspHeader = await buildCspHeader(
            {
                "default-src": ["from.app"],
            },
            { env: "prod" },
        );

        expect(cspHeader).toContain("from.app");
    });

    test("Should return fallback directives on fetch error", async () => {
        fetchMock.mockResponse("Not found", { status: 404 });

        const cspHeader = await buildCspHeader(
            {
                "default-src": ["from.app"],
            },
            { env: "prod" },
        );

        expect(cspHeader).toEqual("default-src * data: blob: 'unsafe-inline' 'unsafe-eval';");
    });
});
