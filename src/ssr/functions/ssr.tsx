import React, { FunctionComponent } from "react";
import fs from "fs";
import { JSDOM } from "jsdom";
import NodeCache from "node-cache";
import parse from "html-react-parser";
import { getDecoratorUrl } from "../../common/urls";
import { DecoratorFetchProps } from "../../common/common-types";
import { getCsrElements } from "../../common/csr-elements";

const SECONDS_PER_MINUTE = 60;
const FIVE_MINUTES_IN_SECONDS = 5 * SECONDS_PER_MINUTE;

const cache = new NodeCache({
    stdTTL: FIVE_MINUTES_IN_SECONDS,
    checkperiod: SECONDS_PER_MINUTE,
});

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
): Promise<DecoratorElements> =>
    fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.text();
            }
            throw new Error(`${res.status} - ${res.statusText}`);
        })
        .then((res) => {
            const { document } = new JSDOM(res).window;

            const styles = document.getElementById("styles")?.innerHTML;
            if (!styles) {
                throw new Error("Decorator styles element not found!");
            }

            const scripts = document.getElementById("scripts")?.innerHTML;
            if (!scripts) {
                throw new Error("Decorator scripts element not found!");
            }

            const header =
                document.getElementById("header-withmenu")?.innerHTML;
            if (!header) {
                throw new Error("Decorator header element not found!");
            }

            const footer =
                document.getElementById("footer-withmenu")?.innerHTML;
            if (!footer) {
                throw new Error("Decorator footer element not found!");
            }

            const elements = {
                DECORATOR_STYLES: styles.trim(),
                DECORATOR_SCRIPTS: scripts.trim(),
                DECORATOR_HEADER: header.trim(),
                DECORATOR_FOOTER: footer.trim(),
            };

            return elements;
        })
        .catch((e) => {
            if (retries > 0) {
                console.warn(
                    `Failed to fetch decorator, retrying ${retries} more times - Url: ${url} - Error: ${e}`
                );
                return fetchDecorator(url, props, retries - 1);
            }

            throw e;
        });

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps
): Promise<DecoratorElements> => {
    const url = getDecoratorUrl(props);

    if (!props.noCache) {
        const cacheData = cache.get<DecoratorElements>(url);

        if (cacheData) {
            return Promise.resolve(cacheData);
        }
    }

    return fetchDecorator(url, props)
        .then((decoratorElements) => {
            if (!props.noCache) {
                cache.set(url, decoratorElements);
            }
            return decoratorElements;
        })
        .catch((e) => {
            console.error(
                `Failed to fetch decorator, falling back to elements for client-side rendering - Url: ${url} - Error: ${e}`
            );

            const csrElements = getCsrElements(props);

            return {
                DECORATOR_STYLES: csrElements.styles,
                DECORATOR_SCRIPTS: `${csrElements.env}${csrElements.scripts}`,
                DECORATOR_HEADER: csrElements.header,
                DECORATOR_FOOTER: csrElements.footer,
            };
        });
};

export type DecoratorComponents = {
    Styles: FunctionComponent;
    Scripts: FunctionComponent;
    Header: FunctionComponent;
    Footer: FunctionComponent;
};

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps
): Promise<DecoratorComponents> => {
    const elements = await fetchDecoratorHtml(props);
    return parseDecoratorHTMLToReact(elements);
};

export const parseDecoratorHTMLToReact = (
    elements: DecoratorElements
): DecoratorComponents => {
    return {
        Styles: () => <>{parse(elements.DECORATOR_STYLES)}</>,
        Scripts: () => <>{parse(elements.DECORATOR_SCRIPTS)}</>,
        Header: () => <>{parse(elements.DECORATOR_HEADER)}</>,
        Footer: () => <>{parse(elements.DECORATOR_FOOTER)}</>,
    };
};

type Injector = DecoratorFetchProps & {
    filePath: string;
};

type DomInjector = DecoratorFetchProps & {
    dom: JSDOM;
};

export const injectDecoratorServerSide = async ({
    filePath,
    ...props
}: Injector): Promise<string> => {
    const file = fs.readFileSync(filePath).toString();
    const dom = new JSDOM(file);
    return injectDecoratorServerSideDom({ dom, ...props });
};

export const injectDecoratorServerSideDom = async ({
    dom,
    ...props
}: DomInjector): Promise<string> =>
    fetchDecoratorHtml(props).then((elements) => {
        const { head, body } = dom.window.document;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_STYLES);
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        return dom.serialize();
    });
