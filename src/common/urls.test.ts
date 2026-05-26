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

    test("Should JSON stringify object params", () => {
        const url = getDecoratorEndpointUrl({
            env: "prod",
            params: {
                breadcrumbs: [{ title: "Forside", url: "/" }],
            },
        });

        expect(url).toBe(
            'https://www.nav.no/dekoratoren/ssr?breadcrumbs=%5B%7B%22title%22%3A%22Forside%22%2C%22url%22%3A%22%2F%22%7D%5D',
        );
    });
});
