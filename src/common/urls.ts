import { DecoratorNaisEnv, DecoratorUrlProps } from "./common-types";

type NaisUrls = Record<DecoratorNaisEnv, string>;

const externalUrls: NaisUrls = {
    prod: "https://www.nav.no/dekoratoren",
    dev: "https://dekoratoren.ekstern.dev.nav.no",
    beta: "https://dekoratoren-beta.intern.dev.nav.no",
    betaTms: "https://dekoratoren-beta-tms.intern.dev.nav.no",
} as const;

const serviceUrls: NaisUrls = {
    prod: "http://nav-dekoratoren.personbruker",
    dev: "http://nav-dekoratoren.personbruker",
    beta: "http://nav-dekoratoren-beta.personbruker",
    betaTms: "http://nav-dekoratoren-beta-tms.personbruker",
} as const;

const naisGcpClusters: Record<string, true> = {
    "dev-gcp": true,
    "prod-gcp": true,
} as const;

const objectToQueryString = (params: Record<string, any>) =>
    params
        ? Object.entries(params).reduce(
              (acc, [k, v], i) =>
                  v !== undefined
                      ? `${acc}${i ? "&" : "?"}${k}=${encodeURIComponent(
                            typeof v === "object" ? JSON.stringify(v) : v,
                        )}`
                      : acc,
              "",
          )
        : "";

const isNaisApp = () =>
    typeof process !== "undefined" &&
    process.env.NAIS_CLUSTER_NAME &&
    naisGcpClusters[process.env.NAIS_CLUSTER_NAME];

const getNaisUrl = (
    env: DecoratorNaisEnv,
    csr = false,
    serviceDiscovery = true,
) => {
    const shouldUseServiceDiscovery = serviceDiscovery && !csr && isNaisApp();

    return (
        (shouldUseServiceDiscovery ? serviceUrls[env] : externalUrls[env]) ||
        externalUrls.prod
    );
};

export const getDecoratorBaseUrl = (props: DecoratorUrlProps) => {
    return props.env === "localhost"
        ? props.localUrl
        : getNaisUrl(props.env, props.csr, props.serviceDiscovery);
};

export const getDecoratorUrl = (props: DecoratorUrlProps) => {
    const { params, csr } = props;
    const baseUrl = getDecoratorBaseUrl(props);

    if (!params) {
        return baseUrl;
    }

    return `${baseUrl}/${csr ? "env" : "ssr"}${objectToQueryString(params)}`;
};
