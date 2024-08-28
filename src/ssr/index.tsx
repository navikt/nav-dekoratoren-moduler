import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
    DecoratorElements,
} from "../common/common-types";
import { fetchDecoratorHtml } from "./functions/fetch-elements";
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
