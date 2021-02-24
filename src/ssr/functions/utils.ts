import { Params } from "@navikt/nav-dekoratoren-moduler";
import { Props } from "./ssr";

const naisUrls = {
  prod: `https://www.nav.no/dekoratoren`,
  dev: `https://dekoratoren.dev.nav.no`,
  q0: `https://www-q0.nav.no/dekoratoren`,
  Q1: `https://www-q0.nav.no/dekoratoren`,
  q2: `https://www-q0.nav.no/dekoratoren`,
  q6: `https://www-q0.nav.no/dekoratoren`,
};

export const getDekoratorUrl = (props: Props): string => {
  if (props.env === "localhost") {
    const { port, env, ...params } = props;
    const url = `http://localhost:${port}/dekoratoren`;
    return buildUrl(url, params);
  } else {
    const { env, ...params } = props;
    const url = naisUrls[env];
    return buildUrl(url, params);
  }
};

export const buildUrl = (url: string, params: Params) => {
  if (!params) return url;
  return `${url}/?${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}`;
};
