import createFetchMock from "vitest-fetch-mock";
import { vi, beforeEach, afterEach } from "vitest";

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

// Suppress expected console output from production error-path tests.
// Unknown messages are passed through so real issues remain visible.
const SUPPRESSED_LOG_PATTERNS = [
    /^New decorator version:/,
    /^Invalidating decorator cache$/,
];

beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const originalLog = console.log;
    vi.spyOn(console, "log").mockImplementation((...args) => {
        const msg = args[0];
        if (typeof msg === "string" && SUPPRESSED_LOG_PATTERNS.some((p) => p.test(msg))) return;
        originalLog(...args);
    });
});

afterEach(() => {
    vi.restoreAllMocks();
});
