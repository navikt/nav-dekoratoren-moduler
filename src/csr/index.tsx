import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { setParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import {
    setNavCookie,
    getNavCookie,
    isStorageKeyAllowed,
    getAllowedStorage,
} from "./functions/storage";
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
    setNavCookie,
    getNavCookie,
    isStorageKeyAllowed,
    getAllowedStorage,
};

export type {
    DecoratorParams,
    DecoratorLocale,
    AmplitudeParams,
    DecoratorEnvProps,
    DecoratorFetchProps,
    AmplitudeEvent,
};
