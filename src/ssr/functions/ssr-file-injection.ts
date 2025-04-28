import fs from "fs";
import { JSDOM } from "jsdom";
import { injectDecoratorServerSideDocument } from "./ssr-document-injection";
import { DecoratorFetchProps } from "../../common/common-types";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

export const injectDecoratorServerSide = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const file = fs.readFileSync(filePath).toString();
    const dom = new JSDOM(file);
    
    await injectDecoratorServerSideDocument({
        ...props,
        document: dom.window.document,
    });

    return dom.serialize();
};
