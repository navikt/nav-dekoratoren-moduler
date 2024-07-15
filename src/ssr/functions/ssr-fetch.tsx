import { getDecoratorUrl } from "../../common/urls";
import { DecoratorFetchProps } from "../../common/common-types";
import { getCsrElements } from "../../common/csr-elements";

export type DecoratorElements = {
    DECORATOR_STYLES: string;
    DECORATOR_SCRIPTS: string;
    DECORATOR_HEADER: string;
    DECORATOR_FOOTER: string;
    DECORATOR_HEAD_ASSETS: string;
};

export type SsrResponse = {
    header: string;
    footer: string;
    scripts: string;
    styles: string;
    headAssets: string;
};

const fetchDecoratorFragments = async (
    url: string,
    props: DecoratorFetchProps,
    retries = 3,
): Promise<DecoratorElements> =>
    fetch(url)
        .then((res) => {
            if (res.ok) {
                console.log("Fetched ok!");
                return res.json() as Promise<SsrResponse>;
            }
            throw new Error(`${res.status} - ${res.statusText}`);
        })
        .then((res) => {
            const { header, footer, scripts, styles, headAssets } = res;

            if (!styles) {
                throw new Error("Decorator styles element not found!");
            }

            if (!scripts) {
                throw new Error("Decorator scripts element not found!");
            }

            if (!header) {
                throw new Error("Decorator header element not found!");
            }

            if (!footer) {
                throw new Error("Decorator footer element not found!");
            }

            if (!headAssets) {
                throw new Error("Decorator head assets not found!");
            }

            const elements: DecoratorElements = {
                DECORATOR_STYLES: styles,
                DECORATOR_SCRIPTS: scripts,
                DECORATOR_HEADER: header,
                DECORATOR_FOOTER: footer,
                DECORATOR_HEAD_ASSETS: headAssets,
            };

            return elements;
        })
        .catch((e) => {
            if (retries > 0) {
                console.warn(
                    `Failed to fetch decorator, retrying ${retries} more times - Url: ${url} - Error: ${e}`,
                );
                return fetchDecoratorFragments(url, props, retries - 1);
            }

            throw e;
        });

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps,
): Promise<DecoratorElements> => {
    const url = getDecoratorUrl(props);

    return fetchDecoratorFragments(url, props).catch((e) => {
        console.error(
            `Failed to fetch decorator, falling back to elements for client-side rendering - Url: ${url} - Error: ${e}`,
        );

        const csrElements = getCsrElements(props);

        return {
            DECORATOR_STYLES: csrElements.styles,
            DECORATOR_SCRIPTS: `${csrElements.env}${csrElements.scripts}`,
            DECORATOR_HEADER: csrElements.header,
            DECORATOR_FOOTER: csrElements.footer,
            DECORATOR_HEAD_ASSETS: "",
        };
    });
};
