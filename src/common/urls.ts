import { NaisEnv, Params } from "./common-types";

export const naisUrls: { [env in NaisEnv]: string } = {
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

export const buildUrl = (url: string, params: Params, csr?: boolean) => {
    if (!params) {
        return url;
    }

    return `${url}/${csr ? "env" : ""}${objectToQueryString(params)}`;
};
