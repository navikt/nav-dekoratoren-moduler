import { NaisEnv, Params } from "./common-types";

export const naisUrls: { [env in NaisEnv]: string } = {
  prod: "https://www.nav.no/dekoratoren",
  q0: "https://www-q0.nav.no/dekoratoren",
  q1: "https://www-q1.nav.no/dekoratoren",
  q2: "https://www-q2.nav.no/dekoratoren",
  q6: "https://www-q6.nav.no/dekoratoren",
  dev: "https://dekoratoren.dev.nav.no",
  eksternDev: "https://dekoratoren.ekstern.dev.nav.no",
};

export const buildUrl = (url: string, params: Params, csr?: boolean) => {
  if (!params) {
    return url;
  }

  return `${url}/${csr ? "env" : ""}?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(
          Array.isArray(value) ? JSON.stringify(value) : value
        )}`
    )
    .join("&")}`;
};
