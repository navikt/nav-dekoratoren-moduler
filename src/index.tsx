import EnforceLoginLoader, { Auth } from './components/EnforceLoginLoader';
import { setBreadcrumbs, onBreadcrumbClick } from './functions/breadcrumbs';
import { setAvailableLanguages, onLanguageSelect } from './functions/languages';
import { getUrlFromLookupTable } from './url-lookup-table/utils';
import { fetchDecoratorReact, fetchDecoratorHtml } from './functions/ssr';
import { urlLookupTable } from './url-lookup-table/table';
import { setParams } from './functions/params';

const SSR = {
  fetchDecoratorReact,
  fetchDecoratorHtml
};

export {
  SSR,
  EnforceLoginLoader,
  setAvailableLanguages,
  onLanguageSelect,
  setBreadcrumbs,
  onBreadcrumbClick,
  setParams,
  urlLookupTable,
  getUrlFromLookupTable
};

export type { Auth };
