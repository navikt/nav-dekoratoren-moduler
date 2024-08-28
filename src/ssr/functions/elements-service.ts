import {
    DecoratorElements,
    DecoratorEnv,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../../common/common-types";
import { addDecoratorUpdateListener } from "./update-events";
import { getDecoratorEndpointUrl } from "../../common/urls";
import { fetchSsrElements } from "./fetch-elements";
import { getCsrElements } from "../../common/csr-elements";

type CacheEntry = {
    expires: number;
    versionId: string;
    elements: DecoratorElements;
};

type Args = {
    envProps: DecoratorEnvProps;
    cacheTtl?: number;
};

const ONE_HOUR_MS = 3600 * 1000;

class DecoratorElementsService {
    private readonly cache: Map<string, CacheEntry>;
    private readonly cacheTtl: number;

    constructor({ envProps, cacheTtl = ONE_HOUR_MS }: Args) {
        this.cache = new Map();
        this.cacheTtl = cacheTtl;

        addDecoratorUpdateListener(envProps, this.invalidate);
    }

    public async get(props: DecoratorFetchProps): Promise<DecoratorElements> {
        const url = getDecoratorEndpointUrl(props);

        if (props.noCache) {
            return fetchSsrElements(url).then((res) => {
                return res?.elements || this.csrFallback(props);
            });
        }

        const fromCache = this.cache.get(url);
        if (fromCache && fromCache.expires < Date.now()) {
            return fromCache.elements;
        }

        const ssrResponse = await fetchSsrElements(url);

        if (!ssrResponse) {
            // Try to reuse old cache item if the fetch failed
            return fromCache?.elements || this.csrFallback(props);
        }

        this.cache.set(url, {
            elements: ssrResponse.elements,
            versionId: ssrResponse.versionId,
            expires: Date.now() + this.cacheTtl,
        });

        return ssrResponse.elements;
    }

    public invalidate = () => {
        console.log(`Invalidating decorator cache`);

        this.cache.forEach((cacheEntry) => {
            cacheEntry.expires = 0;
        });
    };

    private csrFallback(props: DecoratorFetchProps): DecoratorElements {
        console.error("Failed to fetch SSR decorator elements - Falling back to CSR elements");

        const csrElements = getCsrElements(props);

        return {
            DECORATOR_HEAD_ASSETS: csrElements.styles,
            DECORATOR_SCRIPTS: `${csrElements.env}${csrElements.scripts}`,
            DECORATOR_HEADER: csrElements.header,
            DECORATOR_FOOTER: csrElements.footer,
        };
    }
}

const servicePerEnv: { [key in DecoratorEnv]?: DecoratorElementsService } = {};

export const getDecoratorElements = async (
    props: DecoratorFetchProps,
): Promise<DecoratorElements> => {
    const { env } = props;
    if (!servicePerEnv[env]) {
        servicePerEnv[env] = new DecoratorElementsService({ envProps: props });
    }

    return servicePerEnv[env]!.get(props);
};
