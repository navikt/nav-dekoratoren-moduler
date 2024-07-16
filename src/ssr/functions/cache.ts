import NodeCache from "node-cache";
import { DecoratorElements } from "./ssr-fetch";
import { DecoratorEnv, DecoratorNaisEnv } from "../../common/common-types";

type DecoratorUpdateListener = (versionId: string) => unknown;

type DecoratorCaches = { [key in DecoratorEnv]?: NodeCache };

const ONE_DAY = 24 * 3600;
const UPDATE_RATE_MS = 5000;

const listeners: Set<DecoratorUpdateListener> = new Set();

class DecoratorCache {
    private caches: DecoratorCaches = {};

    constructor() {}

    public get(url: string, env: DecoratorEnv) {
        return this.cache(env).get<DecoratorElements>(url);
    }

    public set(url: string, env: DecoratorEnv, elements: DecoratorElements) {
        return this.cache(env).set<DecoratorElements>(url, elements);
    }

    public clear(env: DecoratorEnv) {
        console.log(`Clearing cache for env ${env}`);
        this.caches[env]?.flushAll();
    }

    private cache(env: DecoratorEnv): NodeCache {
        if (!this.caches[env]) {
            this.caches[env] = new NodeCache({
                stdTTL: ONE_DAY,
            });
        }

        return this.caches[env];
    }
}

export const decoratorCache = new DecoratorCache();
