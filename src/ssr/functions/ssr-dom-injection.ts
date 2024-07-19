import { DecoratorFetchProps } from "../../common/common-types";
import { JSDOM } from "jsdom";
import fs from "fs";
import { fetchDecoratorHtml } from "./ssr-fetch";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

type InjectWithDom = DecoratorFetchProps & {
    dom: JSDOM;
};

export const injectDecoratorServerSide = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const file = fs.readFileSync(filePath).toString();
    const dom = new JSDOM(file);
    return injectDecoratorServerSideDom({ dom, ...props });
};

export const injectDecoratorServerSideDom = async ({
    dom,
    ...props
}: InjectWithDom): Promise<string> =>
    fetchDecoratorHtml(props).then((elements) => {
        const { head, body } = dom.window.document;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_HEAD_ASSETS);
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_STYLES);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        return dom.serialize();
    });
