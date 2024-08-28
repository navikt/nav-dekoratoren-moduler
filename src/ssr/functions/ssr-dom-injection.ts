import {
    DecoratorElements,
    DecoratorFetchProps,
} from "../../common/common-types";
import { JSDOM } from "jsdom";
import fs from "fs";
import { getDecoratorEndpointUrl } from "../../common/urls";
import { getCsrElements } from "../../common/csr-elements";
import { fetchSsrElements } from "./fetch-elements";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

type InjectWithDocument = DecoratorFetchProps & {
    document: Document;
};

export const injectDecoratorIntoFile = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const file = fs.readFileSync(filePath).toString();
    const dom = new JSDOM(file);
    return injectDecoratorIntoDocument({
        ...props,
        document: dom.window.document,
    });
};

export const injectDecoratorIntoDocument = async ({
    document,
    ...props
}: InjectWithDocument): Promise<string> =>
    fetchDecoratorHtml(props).then((elements) => {
        const { head, body } = document;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_HEAD_ASSETS);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        return document.documentElement.outerHTML;
    });

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps,
): Promise<DecoratorElements> => {
    const url = getDecoratorEndpointUrl(props);

    return fetchSsrElements(url).catch((e) => {
        console.error(
            `Failed to fetch decorator, falling back to elements for client-side rendering - Url: ${url} - Error: ${e}`,
        );

        const csrElements = getCsrElements(props);

        return {
            DECORATOR_HEAD_ASSETS: csrElements.styles,
            DECORATOR_SCRIPTS: `${csrElements.env}${csrElements.scripts}`,
            DECORATOR_HEADER: csrElements.header,
            DECORATOR_FOOTER: csrElements.footer,
        };
    });
};
