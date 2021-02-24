import { Props } from "./ssr";
import { ENV } from "../types/env";

export const getDekoratorUrl = (props: Props): string => {
  const { env, port, ...params } = props;
  const envUrl = {
    [ENV.LOCALHOST]: `http://localhost:${port}`,
    [ENV.PROD]: `https://www.nav.no/dekoratoren`,
    [ENV.DEV]: `https://dekoratoren.dev.nav.no`,
    [ENV.Q0]: `https://www-q0.nav.no/dekoratoren`,
    [ENV.Q1]: `https://www-q0.nav.no/dekoratoren`,
    [ENV.Q2]: `https://www-q0.nav.no/dekoratoren`,
    [ENV.Q6]: `https://www-q0.nav.no/dekoratoren`,
  };

  if (!params) return envUrl[env];
  return `${envUrl[env]}/?${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}`;
};
