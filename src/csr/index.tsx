import EnforceLoginLoader, { Auth } from "./components/EnforceLoginLoader";
import { setBreadcrumbs, onBreadcrumbClick } from "./functions/breadcrumbs";
import { Breadcrumb } from "./functions/breadcrumbs";
import { setAvailableLanguages, onLanguageSelect } from "./functions/languages";
import { Language } from "./functions/languages";
import { injectDecorator } from "./functions/csr";
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
  injectDecorator,
};

export type { Breadcrumb, Language, Auth, Params };
