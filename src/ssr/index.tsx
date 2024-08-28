import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
    DecoratorElements,
} from "../common/common-types";
import { buildCspHeader } from "./functions/csp";
import { DecoratorComponentsReact, fetchDecoratorReact } from "./functions/ssr-react";
import {
    injectDecoratorServerSide,
    injectDecoratorServerSideDocument,
} from "./functions/ssr-injection";
import {
    addDecoratorUpdateListener,
    getDecoratorVersionId,
    removeDecoratorUpdateListener,
} from "./functions/version-watcher";
import { fetchDecoratorHtml } from "./functions/ssr-html";

export {
    injectDecoratorServerSide,
    injectDecoratorServerSideDocument,
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
