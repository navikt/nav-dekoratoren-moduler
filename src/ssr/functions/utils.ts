import { Params } from "@navikt/nav-dekoratoren-moduler";

export type ENV = "prod" | "dev" | "q1" | "q2" | "q6";

export function getDekoratorUrl(env: ENV, params?: Params): string {
  const envUrl = {
    prod: "https://www.nav.no/dekoratoren",
    dev: "https://dekoratoren.dev.nav.no",
    q1: "https://www-q1.nav.no/dekoratoren",
    q2: "https://www-q2.nav.no/dekoratoren",
    q6: "https://www-q6.nav.no/dekoratoren",
  };

  if (!params) return envUrl[env];
  return `${envUrl[env]}/?${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}`;
}
