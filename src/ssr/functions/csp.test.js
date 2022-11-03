import { enableFetchMocks } from "jest-fetch-mock";
import { getCspHeader } from "./csp";

const decoratorDirectives = {
    "default-src": ["*.nav.no", "localhost:*"],
    "script-src": [
        "*.nav.no",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "localhost:*",
    ],
    "script-src-elem": [
        "*.nav.no",
        "*.psplugin.com",
        "www.googletagmanager.com",
        "www.google-analytics.com",
        "*.hotjar.com",
        "*.hotjar.io",
        "*.taskanalytics.com",
        "'unsafe-inline'",
        "asdf",
        "asdf",
        "localhost:*",
    ],
    "worker-src": ["blob:", "localhost:*"],
    "style-src": ["'unsafe-inline'", "localhost:*"],
    "style-src-elem": [
        "*.nav.no",
        "*.psplugin.com",
        "'unsafe-inline'",
        "localhost:*",
    ],
    "font-src": ["*.psplugin.com", "data:", "localhost:*"],
    "img-src": [
        "*.nav.no",
        "*.psplugin.com",
        "www.google-analytics.com",
        "*.vimeocdn.com",
        "localhost:*",
    ],
    "frame-src": [
        "*.hotjar.com",
        "*.hotjar.io",
        "www.googletagmanager.com",
        "player.vimeo.com",
        "video.qbrick.com",
        "localhost:*",
    ],
    "connect-src": [
        "*.nav.no",
        "*.boost.ai",
        "*.psplugin.com",
        "www.google-analytics.com",
        "*.hotjar.com",
        "*.hotjar.io",
        "localhost:*",
    ],
};

describe("CSP header builder function", async () => {
    enableFetchMocks();
    fetch.mockResponse(JSON.stringify(decoratorDirectives));

    const appDirectives = {
        "default-src": ["*.foo"],
    };
    const cspHeader = await getCspHeader(appDirectives);
    console.log(cspHeader);

    test("test", () => {
        expect(typeof cspHeader).toContain("string");
    });
});
