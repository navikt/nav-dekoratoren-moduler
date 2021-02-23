import EnforceLoginLoader, { Auth } from "./components/EnforceLoginLoader";
import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { getUrlFromLookupTable } from "./url-lookup-table/utils";
import { urlLookupTable } from "./url-lookup-table/table";
import { setParams, Params } from "./functions/params";

export {
  EnforceLoginLoader,
  setAvailableLanguages,
  onLanguageSelect,
  setBreadcrumbs,
  onBreadcrumbClick,
  setParams,
  urlLookupTable,
  getUrlFromLookupTable,
};

export type { Auth, Params };
