import { NaisEnv, Params, Props } from "./common-types";

const naisUrls: { [env in NaisEnv]: string } = {
    prod: "https://www.nav.no/dekoratoren",
    dev: "https://dekoratoren.ekstern.dev.nav.no",
};

const objectToQueryString = (params: object) =>
    params
        ? Object.entries(params).reduce(
              (acc, [k, v], i) =>
                  v !== undefined
                      ? `${acc}${i ? "&" : "?"}${k}=${encodeURIComponent(
                            typeof v === "object" ? JSON.stringify(v) : v
                        )}`
                      : acc,
              ""
          )
        : "";

const buildUrl = (url: string, params: Params, isCsr: boolean) => {
    if (!params) {
        return url;
    }

    return `${url}/${isCsr ? "env" : ""}${objectToQueryString(params)}`;
};

const getBaseUrl = (props: Props) => {
    const { env } = props;

    if (env === "localhost") {
        const { port = 8088, dekoratorenUrl } = props;
        return dekoratorenUrl || `http://localhost:${port}/dekoratoren`;
    }

    return naisUrls[env] || naisUrls.prod;
};

export const getDecoratorUrl = (
    props: Props,
    withParams: boolean,
    isCsr: boolean
) => {
    const baseUrl = getBaseUrl(props);
    const { dekoratorenUrl, env, port, ...params } = props;

    return withParams ? buildUrl(baseUrl, params, isCsr) : baseUrl;
};
