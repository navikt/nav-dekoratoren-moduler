import { DecoratorEnv } from "../../common/common-types";
import { getDecoratorBaseUrl } from "../../common/urls";

type DecoratorUpdateCallback = (versionId: string) => unknown;
type CallbacksSet = Set<DecoratorUpdateCallback>;

type ListenerData = {
    callbacks: CallbacksSet;
    updateTimer: NodeJS.Timeout;
    versionId: string;
};

type VersionApiResponse = {
    localVersion: string;
    authoritativeVersion: string;
};

const UPDATE_RATE_MS = 5000;

class DecoratorUpdateListeners {
    private listenersPerEnv: { [key in DecoratorEnv]?: ListenerData } = {};

    public addListener(callback: DecoratorUpdateCallback, env: DecoratorEnv) {
        this.callbacks(env).add(callback);
    }

    public removeListener(
        callback: DecoratorUpdateCallback,
        env: DecoratorEnv,
    ) {
        const callbacks = this.callbacks(env);
        callbacks.delete(callback);
    }

    private callbacks(env: DecoratorEnv): CallbacksSet {
        return this.listeners(env).callbacks;
    }

    private listeners(env: DecoratorEnv) {
        if (!this.listenersPerEnv[env]) {
            this.initListener(env);
        }

        return this.listenersPerEnv[env]!;
    }

    private initListener(env: DecoratorEnv) {
        const baseUrl = getDecoratorBaseUrl({
            env,
            serviceDiscovery: true,
            localUrl: "",
        });

        const versionApiUrl = `${baseUrl}/api/version`;

        const updateTimer = setInterval(
            () =>
                this.fetchVersion(versionApiUrl).then((freshVersionId) => {
                    if (!freshVersionId) {
                        return;
                    }

                    if (listenerData.versionId === freshVersionId) {
                        return;
                    }

                    listenerData.versionId = freshVersionId;
                    listenerData.callbacks.forEach((callback) =>
                        callback(freshVersionId),
                    );
                }),
            UPDATE_RATE_MS,
        );

        const listenerData: ListenerData = {
            callbacks: new Set(),
            updateTimer,
            versionId: "",
        };

        this.listenersPerEnv[env] = listenerData;
    }
    private fetchVersion = async (url: string) => {
        return fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json() as Promise<VersionApiResponse>;
                }
                throw Error(`Bad response: ${res.status} ${res.statusText}`);
            })
            .then((res) => {
                return res.authoritativeVersion;
            })
            .catch((e) => {
                console.error(`Error fetching decorator version - ${e}`);
                return null;
            });
    };

    private deleteListener(env: DecoratorEnv) {
        const listener = this.listenersPerEnv[env];
        if (!listener) {
            return;
        }

        clearInterval(listener.updateTimer);
        delete this.listenersPerEnv[env];
    }
}

export const decoratorUpdateListeners = new DecoratorUpdateListeners();
