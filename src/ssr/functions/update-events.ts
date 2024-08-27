import { DecoratorEnv, DecoratorEnvProps } from "../../common/common-types";
import { getDecoratorBaseUrl } from "../../common/urls";

type DecoratorUpdateCallback = (versionId: string) => unknown;

type VersionApiResponse = {
    versionId: string;
    timestamp: string;
};

const UPDATE_RATE_MS = 10000;

// Keep this record at file scope to prevent multiple timers running per environment
// in the event that the DecoratorUpdateListener is instantiated multiple times for
// the same environment
const updateTimers: { [key in DecoratorEnv]?: NodeJS.Timeout } = {};

class DecoratorUpdateListener {
    private readonly versionApiUrl: string;
    private readonly envProps: DecoratorEnvProps;
    private readonly callbacks = new Set<DecoratorUpdateCallback>();

    private versionInfo: VersionApiResponse;

    constructor(envProps: DecoratorEnvProps) {
        this.envProps = envProps;
        this.versionApiUrl = `${getDecoratorBaseUrl(envProps)}/api/version`;
        this.versionInfo = {
            versionId: "",
            timestamp: "",
        };
    }

    public async init() {
        const versionInfo = await this.fetchVersionInfo();
        if (versionInfo) {
            this.versionInfo = versionInfo;
        }

        const { env } = this.envProps;

        if (updateTimers[env]) {
            console.warn(
                `Listener was already initiated for env ${env} - recreating`,
            );
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
        return this.versionInfo.versionId;
    }

    private refresh = async () => {
        this.fetchVersionInfo().then((versionInfo) => {
            if (!versionInfo) {
                return;
            }

            if (
                this.versionInfo.versionId === versionInfo.versionId ||
                this.versionInfo.timestamp > versionInfo.timestamp
            ) {
                return;
            }

            console.log(
                `Setting new decorator version id to ${versionInfo.versionId} (ts: ${versionInfo.timestamp})`,
            );

            this.versionInfo = versionInfo;
            this.callbacks.forEach((callback) =>
                callback(versionInfo.versionId),
            );
        });
    };

    private fetchVersionInfo = async () => {
        return fetch(this.versionApiUrl)
            .then((res) => {
                if (res.ok) {
                    return res.json() as Promise<VersionApiResponse>;
                }
                throw Error(`Bad response: ${res.status} ${res.statusText}`);
            })
            .catch((e) => {
                console.error(`Error fetching decorator version - ${e}`);
                return null;
            });
    };
}

const updateListeners: { [key in DecoratorEnv]?: DecoratorUpdateListener } = {};

const getDecoratorUpdateListener = async (
    envProps: DecoratorEnvProps,
): Promise<DecoratorUpdateListener> => {
    const { env } = envProps;
    if (!updateListeners[env]) {
        updateListeners[env] = await new DecoratorUpdateListener(
            envProps,
        ).init();
    }

    return updateListeners[env];
};

export const addDecoratorUpdateListener = (
    envProps: DecoratorEnvProps,
    callback: DecoratorUpdateCallback,
) => {
    getDecoratorUpdateListener(envProps).then((listener) =>
        listener.addCallback(callback),
    );
};

export const removeDecoratorUpdateListener = (
    envProps: DecoratorEnvProps,
    callback: DecoratorUpdateCallback,
) => {
    getDecoratorUpdateListener(envProps).then((listener) =>
        listener.removeCallback(callback),
    );
};

export const getDecoratorVersionId = async (envProps: DecoratorEnvProps) => {
    return getDecoratorUpdateListener(envProps).then((listener) =>
        listener.getVersionId(),
    );
};
