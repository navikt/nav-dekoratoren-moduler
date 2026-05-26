import { getDecoratorEndpointUrl } from "./urls";

describe("decorator URLs", () => {
    test("Should ignore undefined params without breaking query string separators", () => {
        const url = getDecoratorEndpointUrl({
            env: "prod",
            params: {
                context: undefined,
                language: "nb",
            },
        });

        expect(url).toBe("https://www.nav.no/dekoratoren/ssr?language=nb");
    });
});
