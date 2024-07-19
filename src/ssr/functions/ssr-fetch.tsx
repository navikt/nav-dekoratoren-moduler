import { getDecoratorUrl } from "../../common/urls";
import { DecoratorFetchProps } from "../../common/common-types";
import { getCsrElements } from "../../common/csr-elements";
import { decoratorCache } from "./cache";

export type DecoratorElements = {
    DECORATOR_STYLES: string;
    DECORATOR_SCRIPTS: string;
    DECORATOR_HEADER: string;
    DECORATOR_FOOTER: string;
    DECORATOR_HEAD_ASSETS: string;
};

export type SsrFragments = Record<(typeof fragmentKeys)[number], string>;

export type SsrResponse = SsrFragments & {
    versionId: string;
};

const fragmentKeys = [
    "header",
    "footer",
    "scripts",
    "styles",
    "headAssets",
] as const;

const fetchDecoratorElements = async (
    url: string,
    retries = 3,
): Promise<DecoratorElements> =>
    fetch(url)
        .then((res) => {
            if (res.ok) {
                console.log("Fetched ok!");
                return res.json() as Promise<SsrResponse>;
            }
            throw new Error(
                `Error fetching decorator: ${res.status} - ${res.statusText}`,
            );
        })
        .then((res): DecoratorElements => {
            const missingFragments: string[] = fragmentKeys.filter(
                (key) => !res[key],
            );

            if (missingFragments.length > 0) {
                throw new Error(
                    `Elements missing from decorator response: ${missingFragments.join(", ")}`,
                );
            }

            return {
                DECORATOR_HEADER: res.header,
                DECORATOR_FOOTER: res.footer,
                DECORATOR_SCRIPTS: res.scripts,
                DECORATOR_STYLES: res.styles,
                DECORATOR_HEAD_ASSETS: res.headAssets,
            };
        })
        .catch((e) => {
            if (retries > 0) {
                console.warn(
                    `Failed to fetch decorator, retrying ${retries} more times - Url: ${url} - Error: ${e}`,
                );
                return fetchDecoratorElements(url, retries - 1);
            }

            throw e;
        });

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps,
): Promise<DecoratorElements> => {
    const { noCache } = props;
    const url = getDecoratorUrl(props);

    if (!noCache) {
        const fromCache = decoratorCache(props).get(url);
        if (fromCache) {
            return fromCache;
        }
    }

    return fetchDecoratorElements(url)
        .then((elements) => {
            if (!noCache) {
                decoratorCache(props).set(url, elements);
            }
            return elements;
        })
        .catch((e) => {
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
