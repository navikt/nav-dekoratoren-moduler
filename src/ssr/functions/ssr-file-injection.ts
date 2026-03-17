import fs from "fs";
import { getDecoratorElements } from "./decorator-elements-service";
import { DecoratorFetchProps } from "../../common/common-types";

type InjectWithFile = DecoratorFetchProps & {
    filePath: string;
};

export const injectDecoratorServerSide = async ({
    filePath,
    ...props
}: InjectWithFile): Promise<string> => {
    const html = fs.readFileSync(filePath).toString();
    const elements = await getDecoratorElements(props);

    return html
        .replace("</head>", `${elements.DECORATOR_HEAD_ASSETS}</head>`)
        .replace(/(<body(?:\s[^>]*)?>)/, `$1${elements.DECORATOR_HEADER}`)
        .replace("</body>", `${elements.DECORATOR_FOOTER}${elements.DECORATOR_SCRIPTS}</body>`);
};
