import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import NodeCache from "node-cache";
import React, { FunctionComponent } from "react";
import { getDecoratorUrl } from "../../common/urls";
import fs from "fs";
import { DecoratorFetchProps } from "../../common/common-types";
import parse from "react-html-parser";

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

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps
): Promise<DecoratorElements> => {
    const url = getDecoratorUrl(props);

    const cacheData = cache.get(url);
    if (cacheData) {
        return new Promise((resolve) =>
            resolve(cacheData as DecoratorElements)
        );
    }

    return fetch(url)
        .then((res) => {
            return res.text();
        })
        .then((res) => {
            const { document } = new JSDOM(res).window;
            const styles = document.getElementById("styles")?.innerHTML;
            const scripts = document.getElementById("scripts")?.innerHTML;
            const header =
                document.getElementById("header-withmenu")?.innerHTML;
            const footer =
                document.getElementById("footer-withmenu")?.innerHTML;

            if (!header || !footer || !styles || !scripts) {
                throw new Error("'Elements doesn't exist");
            }

            const elements = {
                DECORATOR_STYLES: styles.trim(),
                DECORATOR_SCRIPTS: scripts.trim(),
                DECORATOR_HEADER: header.trim(),
                DECORATOR_FOOTER: footer.trim(),
            };

            cache.set(url, elements);
            return elements;
        });
};

export interface Components {
    Styles: FunctionComponent;
    Scripts: FunctionComponent;
    Header: FunctionComponent;
    Footer: FunctionComponent;
}

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps
): Promise<Components> => {
    const elements = await fetchDecoratorHtml(props);
    return parseDecoratorHTMLToReact(elements);
};

export const parseDecoratorHTMLToReact = (
    elements: DecoratorElements
): Components => {
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
        const head = dom.window.document.head;
        const body = dom.window.document.body;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_STYLES);
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        return dom.serialize();
    });
