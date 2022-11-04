const { enableFetchMocks } = require("jest-fetch-mock");
const { getCspHeader } = require("./csp");

describe("CSP header builder function", () => {
    enableFetchMocks();

    test("Should not include duplicate directives from decorator and app", async () => {
        fetch.mockResponseOnce(JSON.stringify({ "default-src": ["foo.bar"] }));

        const cspHeader = await getCspHeader(
            {
                "default-src": ["foo.bar"],
            },
            {
                env: "localhost",
            }
        );

        expect(cspHeader).toEqual("default-src foo.bar;");
    });

    test("Should include decorator-specific directive", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ "default-src": ["from.decorator"] })
        );

        const cspHeader = await getCspHeader(
            {
                "default-src": ["from.app"],
            },
            {
                env: "localhost",
            }
        );

        expect(cspHeader).toContain("from.decorator");
    });

    test("Should include app-specific directive", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ "default-src": ["from.decorator"] })
        );

        const cspHeader = await getCspHeader(
            {
                "default-src": ["from.app"],
            },
            {
                env: "localhost",
            }
        );

        expect(cspHeader).toContain("from.app");
    });
});
