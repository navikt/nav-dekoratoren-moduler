import {
    DecoratorElements,
    DecoratorEnv,
    DecoratorEnvProps,
    DecoratorFetchProps,
} from "../../common/common-types";
import { addDecoratorUpdateListener } from "./update-events";
import { getDecoratorEndpointUrl } from "../../common/urls";
import { fetchSsrElements } from "./fetch-elements";
import { getCsrFallback } from "../../common/csr-elements";

type CacheEntry = {
    expires: number;
    versionId: string;
    elements: DecoratorElements;
};

class DecoratorElementsService {
    private readonly cache: Record<string, CacheEntry>;
    private readonly cacheTtl: number;
    private readonly envProps: DecoratorEnvProps;

    constructor(envProps: DecoratorEnvProps, cacheTtl: number = 3600 * 1000) {
        this.cache = {};
        this.cacheTtl = cacheTtl;
        this.envProps = envProps;

        addDecoratorUpdateListener(envProps, this.invalidate);
    }

    public async get(props: DecoratorFetchProps): Promise<DecoratorElements> {
        const url = getDecoratorEndpointUrl(props);

        const fromCache = this.cache[url];
        if (fromCache && fromCache.expires < Date.now()) {
            return fromCache.elements;
        }

        const response = await fetchSsrElements(url).catch((e) => {
            console.error(
                `Failed to fetch decorator elements - ${e.toString()}`,
            );
            return null;
        });

        if (!response) {
            // Reuse old cache item if the fetch failed
            return fromCache?.elements || getCsrFallback(props);
        }

        this.cache[url] = {
            elements: response.elements,
            versionId: response.versionId,
            expires: Date.now() + this.cacheTtl,
        };

        return response.elements;
    }

    public invalidate = () => {
        console.log(
            `Invalidating decorator cache for env ${this.envProps.env}`,
        );
        Object.values(this.cache).forEach((cacheEntry) => {
            cacheEntry.expires = 0;
        });
    };
}

const servicePerEnv: { [key in DecoratorEnv]?: DecoratorElementsService } = {};

export const getDecoratorElements = (
    envProps: DecoratorEnvProps,
): DecoratorElementsService => {
    const { env } = envProps;
    if (!servicePerEnv[env]) {
        servicePerEnv[env] = new DecoratorElementsService(envProps);
    }

    return servicePerEnv[env];
};
