import { DecoratorFetchProps } from "../../common/common-types";
import { JSDOM } from "jsdom";
import fs from "fs";
import { fetchDecoratorHtml } from "./ssr-fetch";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

type InjectWithDom = DecoratorFetchProps & {
    document: Document;
};

export const injectDecoratorIntoFile = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const file = fs.readFileSync(filePath).toString();
    const dom = new JSDOM(file);
    return injectDecoratorIntoDocument({
        document: dom.window.document,
        ...props,
    });
};

export const injectDecoratorIntoDocument = async ({
    document,
    ...props
}: InjectWithDom): Promise<string> =>
    fetchDecoratorHtml(props).then((elements) => {
        const { head, body } = document;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_HEAD_ASSETS);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        return document.documentElement.outerHTML;
    });
