import EnforceLoginLoader, { Auth } from "./components/EnforceLoginLoader";
import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { getUrlFromLookupTable } from "./url-lookup-table/utils";
import { urlLookupTable } from "./url-lookup-table/table";
import { setParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import {
    DecoratorParams,
    DecoratorLocale,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../common/common-types";
import {
    AmplitudeParams,
    getAmplitudeInstance,
    logAmplitudeEvent,
} from "./functions/amplitude";
import { AmplitudeEvent } from "./events";

export {
    EnforceLoginLoader,
    setAvailableLanguages,
    onLanguageSelect,
    setBreadcrumbs,
    onBreadcrumbClick,
    setParams,
    urlLookupTable,
    getUrlFromLookupTable,
    injectDecoratorClientSide,
    openChatbot,
    logAmplitudeEvent,
    getAmplitudeInstance,
};

export type {
    Auth,
    DecoratorParams,
    DecoratorLocale,
    AmplitudeParams,
    DecoratorEnvProps,
    DecoratorFetchProps,
    AmplitudeEvent,
};
