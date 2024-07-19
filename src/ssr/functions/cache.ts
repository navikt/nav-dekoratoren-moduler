import NodeCache from "node-cache";
import { DecoratorElements } from "./ssr-fetch";
import { DecoratorEnv, DecoratorEnvProps } from "../../common/common-types";
import { addDecoratorUpdateListener } from "./update-events";

class DecoratorCache {
    private readonly cache: NodeCache;
    private readonly envProps: DecoratorEnvProps;

    constructor(envProps: DecoratorEnvProps, ttl: number) {
        this.envProps = envProps;
        this.cache = new NodeCache({
            stdTTL: ttl,
        });

        addDecoratorUpdateListener(envProps, this.clear);
    }

    public get(url: string) {
        return this.cache.get<DecoratorElements>(url);
    }

    public set(url: string, elements: DecoratorElements) {
        return this.cache.set<DecoratorElements>(url, elements);
    }

    public clear = () => {
        console.log(`Clearing decorator cache for env ${this.envProps.env}`);
        this.cache.flushAll();
    };
}

const caches: { [key in DecoratorEnv]?: DecoratorCache } = {};

export const decoratorCache = (
    envProps: DecoratorEnvProps,
    ttl = 3600,
): DecoratorCache => {
    const { env } = envProps;
    if (!caches[env]) {
        caches[env] = new DecoratorCache(envProps, ttl);
    }

    return caches[env];
};
