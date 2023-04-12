import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../common/common-types";
import {
    fetchDecoratorReact,
    fetchDecoratorHtml,
    parseDecoratorHTMLToReact,
    injectDecoratorServerSideDom,
    injectDecoratorServerSide,
    DecoratorComponents,
    DecoratorElements,
} from "./functions/ssr";
import { buildCspHeader } from "./functions/csp";

export {
    injectDecoratorServerSide,
    injectDecoratorServerSideDom,
    fetchDecoratorReact,
    fetchDecoratorHtml,
    parseDecoratorHTMLToReact,
    buildCspHeader,
};

export type {
    DecoratorElements,
    DecoratorComponents,
    DecoratorParams,
    DecoratorLocale,
    DecoratorFetchProps,
    DecoratorEnvProps,
};
