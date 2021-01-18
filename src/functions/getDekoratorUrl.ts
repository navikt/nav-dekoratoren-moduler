
type Language = "nb" | "nn" | "en" | "se" | "pl";
type Context = "privatperson" | "arbeidsgiver" | "samarbeidspartner";

export interface DekoratorParams {
  context?: Context;
  simple?: boolean;
  enforceLogin?: boolean;
  redirectToApp?: boolean;
  level?: "Level3" | "Level4";
  language?: Language;
  availableLanguages?: [{ locale: Language; url: string }][];
  breadcrumbs?: { title: string; url: string }[];
  feedback?: boolean;
  chatbot?: boolean;
}

const baseUrl = "https://www.nav.no/dekoratoren/";

export function getDekoratorUrl(params?: DekoratorParams): string {
  if (!params) return baseUrl;

  const stringified = {
    ...params,
    availableLanguages: params.availableLanguages && JSON.stringify(params.availableLanguages),
    breadcrumbs: params.breadcrumbs && JSON.stringify(params.breadcrumbs),
  };

  const filtered = Object.entries(stringified).filter((param) => param[1] !== undefined);

  if (filtered.length === 0) return baseUrl;

  return baseUrl + "?" + filtered.map((param) => `${param[0]}=${param[1]}`).join("&");
}
