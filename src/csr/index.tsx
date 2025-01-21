import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { setParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../common/common-types";
import { AmplitudeParams, getAmplitudeInstance, logAmplitudeEvent } from "./functions/amplitude";
import { AmplitudeEvent, AnalyticsEvent } from "./events";
import { AnalyticsParams, logAnalyticsEvent } from "./functions/analytics";

export {
    setAvailableLanguages,
    onLanguageSelect,
    setBreadcrumbs,
    onBreadcrumbClick,
    setParams,
    injectDecoratorClientSide,
    openChatbot,
    logAmplitudeEvent,
    logAnalyticsEvent,
    getAmplitudeInstance,
};

export type {
    DecoratorParams,
    DecoratorLocale,
    AmplitudeParams,
    DecoratorEnvProps,
    DecoratorFetchProps,
    AmplitudeEvent,
    AnalyticsEvent,
    AnalyticsParams,
};
