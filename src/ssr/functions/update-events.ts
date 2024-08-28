import { DecoratorEnv, DecoratorEnvProps } from "../../common/common-types";
import { getDecoratorBaseUrl } from "../../common/urls";

type DecoratorUpdateCallback = (versionId: string) => unknown;

type VersionApiResponse = {
    localVersion: string;
    latestVersion: string;
};

const UPDATE_RATE_MS = 10000;

// Keep this record at file scope to prevent multiple timers running per environment
// in the event that the DecoratorUpdateListener is instantiated multiple times for
// the same environment
const updateTimers: { [key in DecoratorEnv]?: NodeJS.Timeout } = {};

class DecoratorVersionWatcher {
    private readonly callbacks = new Set<DecoratorUpdateCallback>();
    private readonly versionApiUrl: string;
    private readonly envProps: DecoratorEnvProps;

    private versionId: string = "";

    constructor(envProps: DecoratorEnvProps) {
        this.envProps = envProps;

        const baseUrl = getDecoratorBaseUrl(envProps);
        this.versionApiUrl = `${baseUrl}/api/version`;
    }

    public async init() {
        const latestVersionId = await this.fetchLatestVersionId();
        if (latestVersionId) {
            this.versionId = latestVersionId;
        }

        const { env } = this.envProps;

        if (updateTimers[env]) {
            console.warn(`Listener was already initiated for env ${env} - recreating`);
            clearInterval(updateTimers[env]);
        }

        updateTimers[env] = setInterval(this.refresh, UPDATE_RATE_MS);

        return this;
    }

    public addCallback = (callback: DecoratorUpdateCallback) => {
        this.callbacks.add(callback);
    };

    public removeCallback = (callback: DecoratorUpdateCallback) => {
        this.callbacks.delete(callback);
    };

    public getVersionId() {
        return this.versionId;
    }

    private refresh = async () => {
        this.fetchLatestVersionId().then((freshVersionId) => {
            if (!freshVersionId) {
                return;
            }

            if (this.versionId === freshVersionId) {
                return;
            }

            console.log(`New decorator version detected: ${freshVersionId}`);

            this.versionId = freshVersionId;
            this.callbacks.forEach((callback) => callback(freshVersionId));
        });
    };

    private fetchLatestVersionId = async () => {
        return fetch(this.versionApiUrl)
            .then((res) => {
                if (res.ok) {
                    return res.json() as Promise<VersionApiResponse>;
                }
                throw Error(`Bad response: ${res.status} ${res.statusText}`);
            })
            .then((res) => {
                return res.latestVersion;
            })
            .catch((e) => {
                console.error(`Error fetching decorator version - ${e}`);
                return null;
            });
    };
}

const updateListeners: { [key in DecoratorEnv]?: DecoratorVersionWatcher } = {};

const getDecoratorVersionWatcher = async (
    envProps: DecoratorEnvProps,
): Promise<DecoratorVersionWatcher> => {
    const { env } = envProps;
    if (!updateListeners[env]) {
        updateListeners[env] = await new DecoratorVersionWatcher(envProps).init();
    }

    return updateListeners[env];
};

export const addDecoratorUpdateListener = (
    envProps: DecoratorEnvProps,
    callback: DecoratorUpdateCallback,
) => {
    getDecoratorVersionWatcher(envProps).then((listener) => listener.addCallback(callback));
};

export const removeDecoratorUpdateListener = (
    envProps: DecoratorEnvProps,
    callback: DecoratorUpdateCallback,
) => {
    getDecoratorVersionWatcher(envProps).then((listener) => listener.removeCallback(callback));
};

export const getDecoratorVersionId = async (envProps: DecoratorEnvProps) => {
    return getDecoratorVersionWatcher(envProps).then((listener) => listener.getVersionId());
};
