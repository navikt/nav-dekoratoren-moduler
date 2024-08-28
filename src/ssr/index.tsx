import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
    DecoratorElements,
} from "../common/common-types";
import { buildCspHeader } from "./functions/csp";
import { DecoratorComponentsReact, fetchDecoratorReact } from "./functions/ssr-react-components";
import { injectDecoratorServerSideDocument } from "./functions/ssr-document-injection";
import {
    addDecoratorUpdateListener,
    getDecoratorVersionId,
    removeDecoratorUpdateListener,
} from "./functions/version-watcher";
import { fetchDecoratorHtml } from "./functions/ssr-html";
import { injectDecoratorServerSide } from "./functions/ssr-file-injection";

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
