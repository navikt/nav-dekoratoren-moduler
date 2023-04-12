import { DecoratorParams, DecoratorLocale, DecoratorEnvProps, DecoratorFetchProps } from "../common/common-types";
import {
    fetchDecoratorReact,
    fetchDecoratorHtml,
    parseDecoratorHTMLToReact,
    injectDecoratorServerSideDom,
    injectDecoratorServerSide,
    Components,
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

export type { DecoratorElements, Components, DecoratorParams, DecoratorLocale, DecoratorFetchProps, DecoratorEnvProps };
