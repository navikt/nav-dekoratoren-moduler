import EnforceLoginLoader, { Auth } from "./components/EnforceLoginLoader";
import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { getUrlFromLookupTable } from "./url-lookup-table/utils";
import { urlLookupTable } from "./url-lookup-table/table";
import { setParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import { DecoratorParams, DecoratorLocale, DecoratorEnvProps, DecoratorFetchProps } from "../common/common-types";
import { AmplitudeParams, logAmplitudeEvent } from "./functions/amplitude";

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
};

export type { Auth, DecoratorParams, DecoratorLocale, AmplitudeParams, DecoratorEnvProps, DecoratorFetchProps };
