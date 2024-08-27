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
    injectDecoratorIntoFile,
    injectDecoratorIntoDocument,
} from "./functions/ssr-dom-injection";
import {
    addDecoratorUpdateListener,
    getDecoratorVersionId,
    removeDecoratorUpdateListener,
} from "./functions/update-events";

export {
    injectDecoratorIntoFile,
    injectDecoratorIntoDocument,
    fetchDecoratorReact,
    fetchDecoratorHtml,
    buildCspHeader,
    addDecoratorUpdateListener,
    removeDecoratorUpdateListener,
    getDecoratorVersionId,
};

export type {
    DecoratorElements,
    DecoratorComponents,
    DecoratorParams,
    DecoratorLocale,
    DecoratorFetchProps,
    DecoratorEnvProps,
};
