import { Params } from "./params";

export type ENV = "localhost" | "prod" | "dev" | "q0" | "q1" | "q2" | "q6";
export type Props = Params &
  (
    | { env: Exclude<ENV, "localhost"> }
    | { env: Extract<ENV, "localhost">; port: number | string }
  );

export const injectDecorator = async (props: Props) => {
  const url = getDekoratorUrl(props);
  const env = getDekoratorUrl(props, true);

  const header = '<div id="decorator-header"></div>';
  const footer = '<div id="decorator-footer"></div>';
  const scripts = `<div id="decorator-env" data-src="${env}"></div>`;
  const styles = `<link href="${url}/css/client.css" rel="stylesheet" />`;

  document.head.insertAdjacentHTML("beforeend", styles);
  document.head.insertAdjacentHTML("beforeend", scripts);
  document.body.insertAdjacentHTML("beforebegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);

  var script = document.createElement("script");
  script.src = `${url}/client.js`;
  document.body.appendChild(script);
};

const naisUrls = {
  prod: `https://www.nav.no/dekoratoren`,
  q0: `https://www-q0.nav.no/dekoratoren`,
  q1: `https://www-q1.nav.no/dekoratoren`,
  q2: `https://www-q2.nav.no/dekoratoren`,
  q6: `https://www-q6.nav.no/dekoratoren`,
  dev: `https://dekoratoren.dev.nav.no`,
};

export const getDekoratorUrl = (props: Props, forEnv?: boolean): string => {
  if (props.env === "localhost") {
    const { port, env, ...params } = props;
    const url = `http://localhost:${port}/dekoratoren`;
    return forEnv ? buildUrl(url, params) : url;
  } else {
    const { env, ...params } = props;
    const url = naisUrls[env] || naisUrls.prod;
    return forEnv ? buildUrl(url, params) : url;
  }
};
export const buildUrl = (url: string, params: Params) => {
  if (!params) return url;
  return `${url}/env?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(
          Array.isArray(value) ? JSON.stringify(value) : value
        )}`
    )
    .join("&")}`;
};
