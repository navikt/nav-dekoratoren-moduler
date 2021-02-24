import { Props } from "./ssr";

export const getDekoratorUrl = (props: Props): string => {
  const { env, port, ...params } = props;
  const envUrl = {
    localhost: `http://localhost:${port}/dekoratoren`,
    prod: `https://www.nav.no/dekoratoren`,
    dev: `https://dekoratoren.dev.nav.no`,
    q0: `https://www-q0.nav.no/dekoratoren`,
    Q1: `https://www-q0.nav.no/dekoratoren`,
    q2: `https://www-q0.nav.no/dekoratoren`,
    q6: `https://www-q0.nav.no/dekoratoren`,
  };

  if (!params) return envUrl[env];
  return `${envUrl[env]}/?${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}`;
};
