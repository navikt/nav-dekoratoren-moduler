import { readFileSync } from "node:fs";
import pkg from "../../package.json";

const versionPlaceholder = "__NAV_DEKORATOREN_MODULER_VERSION__";

describe("package version replacement", () => {
    test.each(["csr/index.js", "ssr/index.js"])(
        "Should replace the version placeholder in %s",
        (bundlePath) => {
            const bundle = readFileSync(bundlePath, "utf8");

            expect(bundle).toContain(pkg.version);
            expect(bundle).not.toContain(versionPlaceholder);
        },
    );
});
