import { describe, expect, test } from "vitest";

import pkg from "./package.json" with { type: "json" };
import { packageVersionPlugin } from "./rollup.package-version-plugin.mjs";

const versionPlaceholder = "__NAV_DEKORATOREN_MODULER_VERSION__";

describe("package version replacement", () => {
    test("replaces the version placeholder", () => {
        const code = `const version = "${versionPlaceholder}";`;
        const result = packageVersionPlugin().transform(code);

        expect(result).not.toBeNull();
        expect(result?.code).toContain(pkg.version);
        expect(result?.code).not.toContain(versionPlaceholder);
    });

    test("skips files without the version placeholder", () => {
        const result = packageVersionPlugin().transform("const version = 'test';");

        expect(result).toBeNull();
    });
});
