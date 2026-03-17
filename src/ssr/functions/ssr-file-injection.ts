import fs from "fs";
import { getDecoratorElements } from "./decorator-elements-service";
import { DecoratorFetchProps } from "../../common/common-types";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

const inject = (html: string, tag: RegExp, tagName: string, content: string, position: "before" | "after"): string => {
    const result = html.replace(tag, (match) => position === "before" ? `${content}${match}` : `${match}${content}`);
    if (result === html) throw new Error(`Could not find ${tagName} in HTML template`);
    return result;
};

export const injectDecoratorServerSide = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const html = fs.readFileSync(filePath).toString();
    const elements = await getDecoratorElements(props);

    return [
        (h: string) => inject(h, /<\/head\s*>/i, "</head>", elements.DECORATOR_HEAD_ASSETS, "before"),
        (h: string) => inject(h, /<body[^>]*>/i, "<body>", elements.DECORATOR_HEADER, "after"),
        (h: string) => inject(h, /<\/body\s*>/i, "</body>", `${elements.DECORATOR_FOOTER}${elements.DECORATOR_SCRIPTS}`, "before"),
    ].reduce((acc, fn) => fn(acc), html);
};
