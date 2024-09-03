import { DecoratorElements, HtmlElementProps } from "../../common/common-types";

export type SsrResponse = {
    headAssets: string;
    header: string;
    footer: string;
    scripts: string;
    scriptsProps: HtmlElementProps[];
    versionId: string;
};

type OkResponse = {
    elements: DecoratorElements;
    versionId: string;
};

const fragmentKeys = ["headAssets", "header", "footer", "scripts", "scriptsProps"] as const;

export const fetchSsrElements = async (url: string, retries = 3): Promise<OkResponse | null> =>
    fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.json() as Promise<SsrResponse>;
            }
            throw new Error(`Error fetching decorator: ${res.status} - ${res.statusText}`);
        })
        .then((res) => {
            const missingFragments = fragmentKeys.filter((key) => !res[key]);

            if (missingFragments.length > 0) {
                throw new Error(
                    `Elements missing from decorator response: ${missingFragments.join(", ")}`,
                );
            }

            return {
                elements: {
                    DECORATOR_HEAD_ASSETS: res.headAssets,
                    DECORATOR_HEADER: res.header,
                    DECORATOR_FOOTER: res.footer,
                    DECORATOR_SCRIPTS: res.scripts,
                    DECORATOR_SCRIPTS_PROPS: res.scriptsProps,
                },
                versionId: res.versionId,
            };
        })
        .catch((e) => {
            if (retries > 0) {
                console.warn(
                    `Failed to fetch decorator, retrying ${retries} more times - Url: ${url} - Error: ${e}`,
                );
                return fetchSsrElements(url, retries - 1);
            }

            console.error(`Failed to fetch decorator elements from ${url} - ${e.toString()}`);

            return null;
        });
