import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
    DecoratorElements,
} from "../common/common-types";
import { buildCspHeader } from "./functions/csp";
import { DecoratorComponentsReact, fetchDecoratorReact } from "./functions/ssr-react";
import { injectDecoratorIntoFile, injectDecoratorIntoDocument } from "./functions/ssr-injection";
import {
    addDecoratorUpdateListener,
    getDecoratorVersionId,
    removeDecoratorUpdateListener,
} from "./functions/update-events";
import { fetchDecoratorHtml } from "./functions/ssr-html";

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
    DecoratorComponentsReact,
    DecoratorParams,
    DecoratorLocale,
    DecoratorFetchProps,
    DecoratorEnvProps,
};
