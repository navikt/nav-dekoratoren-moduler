import { DecoratorFetchProps } from "../../common/common-types";
import { JSDOM } from "jsdom";
import fs from "fs";
import { getDecoratorElements } from "./elements-service";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

type InjectWithDocument = DecoratorFetchProps & {
    document: Document;
};

export const injectDecoratorServerSide = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const file = fs.readFileSync(filePath).toString();
    const dom = new JSDOM(file);
    return injectDecoratorServerSideDocument({
        ...props,
        document: dom.window.document,
    }).then((document) => document.documentElement.outerHTML);
};

export const injectDecoratorServerSideDocument = async ({
    document,
    ...props
}: InjectWithDocument): Promise<Document> =>
    getDecoratorElements(props).then((elements) => {
        const { head, body } = document;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_HEAD_ASSETS);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        return document;
    });
