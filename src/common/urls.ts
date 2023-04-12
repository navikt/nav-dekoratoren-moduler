import { DecoratorFetchProps, DecoratorNaisEnv } from "./common-types";

type NaisUrls = Record<DecoratorNaisEnv, string>;

const externalUrls: NaisUrls = {
    prod: "https://www.nav.no/dekoratoren",
    dev: "https://dekoratoren.ekstern.dev.nav.no",
    beta: "https://dekoratoren-beta.dev.nav.no",
    betaTms: "https://dekoratoren-beta-tms.dev.nav.no",
};

const serviceUrls: NaisUrls = {
    prod: "http://nav-dekoratoren.personbruker",
    dev: "http://nav-dekoratoren.personbruker",
    beta: "http://nav-dekoratoren-beta.personbruker",
    betaTms: "http://nav-dekoratoren-beta-tms.personbruker",
};

const objectToQueryString = (params: Record<string, any>) =>
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

const getNaisUrl = (env: DecoratorNaisEnv, serviceDiscovery?: boolean) => {
    return (
        (serviceDiscovery ? serviceUrls[env] : externalUrls[env]) ||
        externalUrls.prod
    );
};

export const getDecoratorUrl = (props: DecoratorFetchProps) => {
    const { env, params, serviceDiscovery, csr } = props;
    const baseUrl =
        env === "local" ? props.localUrl : getNaisUrl(env, serviceDiscovery);

    if (!params) {
        return baseUrl;
    }

    return `${baseUrl}/${csr ? "env" : ""}${objectToQueryString(params)}`;
};
