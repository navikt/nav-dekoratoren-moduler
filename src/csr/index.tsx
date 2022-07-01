import EnforceLoginLoader, { Auth } from "./components/EnforceLoginLoader";
import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { injectDecoratorClientSide } from "./functions/csr";
import { getUrlFromLookupTable } from "./url-lookup-table/utils";
import { urlLookupTable } from "./url-lookup-table/table";
import { setParams } from "./functions/params";
import { openChatbot } from "./functions/chatbot";
import { Env, Params, Props, Locale } from "../common/common-types";

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
};

export type { Auth, Params, Props, Env, Locale };
