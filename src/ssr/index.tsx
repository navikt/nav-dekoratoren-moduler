import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../common/common-types";
import { fetchDecoratorHtml, DecoratorElements } from "./functions/ssr-fetch";
import { buildCspHeader } from "./functions/csp";
import {
    DecoratorComponents,
    fetchDecoratorReact,
} from "./functions/ssr-react-parser";
import {
    injectDecoratorServerSide,
    injectDecoratorServerSideDom,
} from "./functions/ssr-dom-injection";
import {
    addDecoratorUpdateListener,
    removeDecoratorUpdateListener,
} from "./functions/update-events";

export {
    injectDecoratorServerSide,
    injectDecoratorServerSideDom,
    fetchDecoratorReact,
    fetchDecoratorHtml,
    buildCspHeader,
    addDecoratorUpdateListener,
    removeDecoratorUpdateListener,
};

export type {
    DecoratorElements,
    DecoratorComponents,
    DecoratorParams,
    DecoratorLocale,
    DecoratorFetchProps,
    DecoratorEnvProps,
};
