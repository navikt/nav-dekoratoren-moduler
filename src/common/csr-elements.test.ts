import { getCsrElements } from "./csr-elements";

describe("CSR elements", () => {
    test("Should include decorator moduler metadata in the data URL", () => {
        const elements = getCsrElements({ env: "prod" });
        const src = elements.env.match(/data-src="([^"]+)"/)?.[1];

        expect(src).toBeDefined();

        const url = new URL(src!);

        expect(url.searchParams.get("decoratorModulerVersion")).toBe(
            "__NAV_DEKORATOREN_MODULER_VERSION__",
        );
        expect(url.searchParams.get("decoratorModulerEntryPoint")).toBe("csr");
    });
});
