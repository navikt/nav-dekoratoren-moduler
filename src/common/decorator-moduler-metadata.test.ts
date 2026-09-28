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
        const params = withMetadata({ teamName: "jabberwock.personbruker" }, "ssr");

        expect(params.teamName).toBe("jabberwock.personbruker");
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

        const params = withMetadata({ teamName: "fra-prop.navno" }, "ssr");

        expect(params.teamName).toBe("fra-env.personbruker");
    });

    test("SSR: warns and falls back to the teamName prop when NAIS_NAMESPACE is missing", () => {
        process.env.NAIS_APP_NAME = "nav-dekoratoren";

        const params = withMetadata({ teamName: "fra-prop.navno" }, "ssr");

        expect(params.teamName).toBe("fra-prop.navno");
        expect(console.warn).toHaveBeenCalled();
    });

    test.each(["min-app", "Min-App.personbruker", "min_app.personbruker", ".personbruker", "min-app.", "min..app", "min app.personbruker", "min/app.personbruker"])(
        "SSR: omits invalid explicit teamName %s and warns in the app",
        (teamName) => {
            const params = withMetadata({ teamName, language: "nb" }, "ssr");

            expect(params).not.toHaveProperty("teamName");
            expect(params.language).toBe("nb");
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("teamName har ugyldig format"));
        },
    );

    test("SSR: omits an invalid teamName derived from NAIS variables and warns once", () => {
        process.env.NAIS_APP_NAME = "Min_App";
        process.env.NAIS_NAMESPACE = "personbruker";

        const params = withMetadata(undefined, "ssr");
        withMetadata(undefined, "ssr");

        expect(params).not.toHaveProperty("teamName");
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("teamName har ugyldig format"));
    });

    test("SSR: warns and uses the explicit teamName when process is undefined", () => {
        vi.stubGlobal("process", undefined);

        const params = withMetadata({ teamName: "min-app.personbruker" }, "ssr");

        expect(params.teamName).toBe("min-app.personbruker");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("NAIS_APP_NAME"));
    });

    test("CSR (browser): uses the explicit teamName prop", () => {
        vi.stubGlobal("process", undefined);

        const params = withMetadata({ teamName: "jabberwock.personbruker" }, "csr");

        expect(params.teamName).toBe("jabberwock.personbruker");
    });

    test("CSR: uses only params.teamName even when NAIS variables are defined", () => {
        process.env.NAIS_APP_NAME = "fra-env";
        process.env.NAIS_NAMESPACE = "personbruker";

        const params = withMetadata({ teamName: "fra-prop.navno" }, "csr");

        expect(params.teamName).toBe("fra-prop.navno");
        expect(console.warn).not.toHaveBeenCalled();
    });

    test("CSR: warns once when teamName is missing even when NAIS variables are defined", () => {
        process.env.NAIS_APP_NAME = "fra-env";
        process.env.NAIS_NAMESPACE = "personbruker";

        const params = withMetadata(undefined, "csr");
        withMetadata(undefined, "csr");

        expect(params).not.toHaveProperty("teamName");
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('params: { teamName: "<app>.<namespace>" }'),
        );
    });

    test("CSR (browser): omits an invalid teamName and warns once", () => {
        vi.stubGlobal("process", undefined);

        const params = withMetadata({ teamName: "Min App.personbruker" }, "csr");
        withMetadata({ teamName: "Min App.personbruker" }, "csr");

        expect(params).not.toHaveProperty("teamName");
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("teamName har ugyldig format"));
    });

    test("CSR (browser): omits teamName and warns when no prop is provided", () => {
        vi.stubGlobal("process", undefined);

        const params = withMetadata(undefined, "csr");

        expect(params.teamName).toBeUndefined();
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('params: { teamName: "<app>.<namespace>" }'),
        );
    });
});
