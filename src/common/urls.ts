import { DecoratorNaisEnv, DecoratorUrlProps } from "./common-types";
import type { ParamsWithMetadata } from "./decorator-moduler-metadata";

type NaisUrls = Record<DecoratorNaisEnv, string>;
type InternalDecoratorUrlProps = DecoratorUrlProps & {
    params?: ParamsWithMetadata;
};
type QueryParamValue = string | number | boolean | object;

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

const naisGcpClusters: ReadonlySet<string> = new Set(["dev-gcp", "prod-gcp"]);

const encodeQueryParam = (value: QueryParamValue) =>
    encodeURIComponent(
        typeof value === "object" ? JSON.stringify(value) : String(value),
    );

const objectToQueryString = (params?: Record<string, QueryParamValue | undefined>) => {
    const definedParams = Object.entries(params ?? {}).filter(
        (entry): entry is [string, QueryParamValue] => entry[1] !== undefined,
    );

    return definedParams.length > 0
        ? `?${definedParams
              .map(([key, value]) => `${key}=${encodeQueryParam(value)}`)
              .join("&")}`
        : "";
};

const isNaisApp = () =>
    typeof process !== "undefined" &&
    process.env.NAIS_CLUSTER_NAME &&
    naisGcpClusters.has(process.env.NAIS_CLUSTER_NAME);

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

export const getDecoratorEndpointUrl = (props: InternalDecoratorUrlProps) => {
    const { params, csr } = props;
    const baseUrl = getDecoratorBaseUrl(props);

    return `${baseUrl}/${csr ? "csr" : "ssr"}${objectToQueryString(params)}`;
};
