import { JSDOM } from "jsdom";

import { DecoratorFetchProps } from "../../common/common-types";
import { getDecoratorUrl } from "../../common/urls";

interface NextFetchRequestConfig {
    next: {
        revalidate?: number | false;
        tags?: string[];
    };
}

export type DecoratorElements = {
    DECORATOR_STYLES: string;
    DECORATOR_SCRIPTS: string;
    DECORATOR_HEADER: string;
    DECORATOR_FOOTER: string;
};

const fetchDecorator = async (
    url: string,
    props: DecoratorFetchProps,
    retries = 3
): Promise<DecoratorElements> => {
    let tryCount = 0;

    const fetchAndParse = async (): Promise<DecoratorElements> => {
        if (tryCount >= retries) {
            throw new Error("Failed to fetch decorator after 3 retries");
        }

        try {
            const response = await fetch(url, {
                next: { revalidate: 15 * 60 },
            } as RequestInit & NextFetchRequestConfig);

            if (!response.ok) {
                throw new Error(`${response.status} - ${response.statusText}`);
            }

            const result = await response.text();

            return parseDom(result);
        } catch (e) {
            console.error(
                new Error(
                    `Failed to fetch decorator (try ${tryCount}), retrying...`,
                    { cause: e }
                )
            );

            tryCount++;
            return fetchAndParse();
        }
    };

    return fetchAndParse();
};

function parseDom(dom: string): DecoratorElements {
    const { document } = new JSDOM(dom).window;

    const styles = document.getElementById("styles")?.innerHTML;
    if (!styles) {
        throw new Error("Decorator styles element not found!");
    }

    const scripts = document.getElementById("scripts")?.innerHTML;
    if (!scripts) {
        throw new Error("Decorator scripts element not found!");
    }

    const header = document.getElementById("header-withmenu")?.innerHTML;
    if (!header) {
        throw new Error("Decorator header element not found!");
    }

    const footer = document.getElementById("footer-withmenu")?.innerHTML;
    if (!footer) {
        throw new Error("Decorator footer element not found!");
    }

    return {
        DECORATOR_STYLES: styles.trim(),
        DECORATOR_SCRIPTS: scripts.trim(),
        DECORATOR_HEADER: header.trim(),
        DECORATOR_FOOTER: footer.trim(),
    };
}

export async function fetchDecoratorHtml(
    props: DecoratorFetchProps
): Promise<DecoratorElements> {
    const url: string = getDecoratorUrl(props);

    try {
        return await fetchDecorator(url, props);
    } catch (e) {
        console.error(
            new Error(
                `Failed to fetch decorator: Do support for fallback to client side rendering yet`,
                { cause: e }
            )
        );

        throw e;
    }
}
