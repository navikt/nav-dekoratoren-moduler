import { vi } from "vitest";
import type { withMetadata as WithMetadataType } from "./decorator-moduler-metadata";

describe("withMetadata", () => {
    const originalEnv = process.env;
    let withMetadata: typeof WithMetadataType;

    beforeEach(async () => {
        process.env = { ...originalEnv };
        delete process.env.NAIS_APP_NAME;
        delete process.env.NAIS_NAMESPACE;

        // Reset the module registry so the module-level "has warned already"
        // flag doesn't leak between tests.
        vi.resetModules();
        ({ withMetadata } = await import("./decorator-moduler-metadata"));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        process.env = originalEnv;
    });

    test("SSR: concatenates NAIS_APP_NAME and NAIS_NAMESPACE into teamName", () => {
        process.env.NAIS_APP_NAME = "jabberwock";
        process.env.NAIS_NAMESPACE = "personbruker";

        const params = withMetadata(undefined, "ssr");

        expect(params.teamName).toBe("jabberwock.personbruker");
    });

    test("SSR: falls back to the explicit teamName prop when NAIS_APP_NAME is missing", () => {
        const params = withMetadata(undefined, "ssr", "jabberwock");

        expect(params.teamName).toBe("jabberwock");
        expect(console.warn).toHaveBeenCalled();
    });

    test("SSR: omits teamName and warns when neither NAIS_APP_NAME nor a prop is available", () => {
        const params = withMetadata(undefined, "ssr");

        expect(params.teamName).toBeUndefined();
        expect(console.warn).toHaveBeenCalled();
    });

    test("SSR: NAIS_APP_NAME takes precedence over an explicit teamName prop", () => {
        process.env.NAIS_APP_NAME = "fra-env";
        process.env.NAIS_NAMESPACE = "personbruker";

        const params = withMetadata(undefined, "ssr", "fra-prop");

        expect(params.teamName).toBe("fra-env.personbruker");
    });

    test("CSR (browser): uses the explicit teamName prop", () => {
        vi.stubGlobal("process", undefined);

        const params = withMetadata(undefined, "csr", "jabberwock");

        expect(params.teamName).toBe("jabberwock");
    });

    test("CSR (browser): omits teamName and warns when no prop is provided", () => {
        vi.stubGlobal("process", undefined);

        const params = withMetadata(undefined, "csr");

        expect(params.teamName).toBeUndefined();
        expect(console.warn).toHaveBeenCalled();
    });
});
