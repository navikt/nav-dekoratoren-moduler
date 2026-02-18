import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { setParams, getParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import {
    isStorageKeyAllowed,
    getAllowedStorage,
    awaitNavWebStorage,
    getCurrentConsent,
} from "./functions/storage/storageHelpers";
import {
    setNavCookie,
    getNavCookie,
    navLocalStorage,
    navSessionStorage,
} from "./functions/storage/storageAPI";
import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../common/common-types";
import { AnalyticsParams, getAnalyticsInstance, logAnalyticsEvent } from "./functions/analytics";

export {
    setAvailableLanguages,
    onLanguageSelect,
    setBreadcrumbs,
    onBreadcrumbClick,
    setParams,
    getParams,
    injectDecoratorClientSide,
    openChatbot,
    logAnalyticsEvent,
    getAnalyticsInstance,
    awaitNavWebStorage as awaitDecoratorData,
    isStorageKeyAllowed,
    getCurrentConsent,
    getAllowedStorage,
    setNavCookie,
    getNavCookie,
    navSessionStorage,
    navLocalStorage,
};

export type {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
    AnalyticsParams,
};

// Re-export types from @navikt/analytics-types for convenience
export type * from "@navikt/analytics-types";
