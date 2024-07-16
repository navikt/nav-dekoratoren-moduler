import NodeCache from "node-cache";
import { DecoratorElements } from "./ssr-fetch";
import { DecoratorEnv } from "../../common/common-types";
import { decoratorUpdateListeners } from "./update-events";

type CachesPerEnv = { [key in DecoratorEnv]?: NodeCache };

const ONE_DAY = 24 * 3600;

class DecoratorCache {
    private cachesPerEnv: CachesPerEnv = {};

    public get(url: string, env: DecoratorEnv) {
        return this.cache(env).get<DecoratorElements>(url);
    }

    public set(url: string, env: DecoratorEnv, elements: DecoratorElements) {
        return this.cache(env).set<DecoratorElements>(url, elements);
    }

    public clear = (env: DecoratorEnv) => {
        console.log(`Clearing cache for env ${env}`);
        this.cachesPerEnv[env]?.flushAll();
    };

    private cache(env: DecoratorEnv): NodeCache {
        if (!this.cachesPerEnv[env]) {
            this.cachesPerEnv[env] = new NodeCache({
                stdTTL: ONE_DAY,
            });
            decoratorUpdateListeners.addListener(() => this.clear(env), env);
        }

        return this.cachesPerEnv[env];
    }
}

export const decoratorCache = new DecoratorCache();
