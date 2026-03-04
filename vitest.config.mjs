import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        resetMocks: false,
        setupFiles: ["./vitest.setup.ts"],
    },
});
