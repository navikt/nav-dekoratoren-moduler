import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { setParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import {
    isStorageKeyAllowed,
    getAllowedStorage,
    awaitDecoratorData,
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
import { AmplitudeParams, getAmplitudeInstance, logAmplitudeEvent } from "./functions/amplitude";
import { AmplitudeEvent } from "./events";

export {
    setAvailableLanguages,
    onLanguageSelect,
    setBreadcrumbs,
    onBreadcrumbClick,
    setParams,
    injectDecoratorClientSide,
    openChatbot,
    logAmplitudeEvent,
    getAmplitudeInstance,
    awaitDecoratorData,
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
    AmplitudeParams,
    DecoratorEnvProps,
    DecoratorFetchProps,
    AmplitudeEvent,
};
