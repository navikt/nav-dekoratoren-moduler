import pkg from "./package.json" with { type: "json" };

// Keep the version as a build-time literal so the CSR bundle does not need a
// runtime package.json import.
export const packageVersionPlugin = () => ({
    name: "package-version",
    transform: (code) =>
        code.includes("__NAV_DEKORATOREN_MODULER_VERSION__")
            ? {
                  code: code.replaceAll(
                      "__NAV_DEKORATOREN_MODULER_VERSION__",
                      pkg.version,
                  ),
                  map: null,
              }
            : null,
});
