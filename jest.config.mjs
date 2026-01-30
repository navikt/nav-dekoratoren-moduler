/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    resetMocks: false,
    setupFiles: ["./jest.setup.js"],
    // forceExit required: Tests use setInterval for polling which creates persistent handles.
    // Proper cleanup is in place (clearInterval, resetMocks, clearAllTimers), but Jest's
    // --detectOpenHandles doesn't work reliably with done() callback pattern in async tests.
    forceExit: true,
};
