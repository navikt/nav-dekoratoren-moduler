import { DecoratorEnv, DecoratorEnvProps } from "../../common/common-types";
import { getDecoratorBaseUrl, getDecoratorEndpointUrl } from "../../common/urls";

type DecoratorUpdateCallback = (versionId: string) => unknown;

type VersionApiResponse = {
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
    private readonly ssrUrl: string;

    private versionId: string = "";
    private contentFingerprint: string | null = null;

    constructor(envProps: DecoratorEnvProps) {
        this.envProps = envProps;

        const baseUrl = getDecoratorBaseUrl(envProps);
        this.versionApiUrl = `${baseUrl}/api/version`;
        this.ssrUrl = getDecoratorEndpointUrl(envProps);
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
        console.log(`[watcher] tick (${this.envProps.env})`);
        console.log(`[watcher] (debug) ssr url = ${this.ssrUrl}`);

        let versionChanged = false;

        this.fetchLatestVersionId()
            .then((freshVersionId) => {
                if (!freshVersionId) {
                    return;
                }

                if (this.versionId === freshVersionId) {
                    return;
                }

                console.log(`New decorator version: ${freshVersionId}`);

                this.versionId = freshVersionId;
                versionChanged = true;
                this.callbacks.forEach((callback) => callback(freshVersionId));
            })
            .finally(async () => {
                // fetch SSR and compute fingerprint on every tick
                try {
                    const res = await fetch(this.ssrUrl);
                    if (!res.ok) {
                        console.log(
                            `[watcher][debug] SSR fetch failed: ${res.status} ${res.statusText}`,
                        );
                    } else {
                        const json = await res.json();
                        const keys = Object.keys(json ?? {});
                        console.log(
                            `[watcher][debug] SSR payload keys: ${keys.join(", ") || "(none)"}`,
                        );

                        const {
                            headAssets = "",
                            header = "",
                            footer = "",
                            scripts = "",
                        } = json ?? {};
                        const fp = [headAssets, header, footer, scripts]
                            .map((s) => (typeof s === "string" ? s.length : 0))
                            .join("|");

                        if (this.contentFingerprint === null) {
                            this.contentFingerprint = fp;
                            console.log(`[watcher][debug] baseline fingerprint: ${fp}`);
                        } else if (this.contentFingerprint !== fp) {
                            console.log(
                                `[watcher][debug] fingerprint ${this.contentFingerprint} -> ${fp}`,
                            );
                            this.contentFingerprint = fp;

                            if (!versionChanged) {
                                console.log(
                                    "[watcher][debug] triggering callbacks due to content change",
                                );
                                console.log(
                                    `[watcher][debug] invoking ${this.callbacks.size} callback(s) with versionId=${this.versionId}`,
                                ); // add
                                this.callbacks.forEach((cb) => cb(this.versionId));
                            }
                        } else {
                            console.log(`[watcher][debug] fingerprint unchanged ${fp}`);
                        }
                    }
                } catch (e) {
                    console.log(`[watcher][debug] SSR fetch error: ${e}`);
                }
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

export const addDecoratorUpdateListener = async (
    envProps: DecoratorEnvProps,
    callback: DecoratorUpdateCallback,
) => {
    return getDecoratorVersionWatcher(envProps).then((listener) => listener.addCallback(callback));
};

export const removeDecoratorUpdateListener = async (
    envProps: DecoratorEnvProps,
    callback: DecoratorUpdateCallback,
) => {
    return getDecoratorVersionWatcher(envProps).then((listener) =>
        listener.removeCallback(callback),
    );
};

export const getDecoratorVersionId = async (envProps: DecoratorEnvProps) => {
    return getDecoratorVersionWatcher(envProps).then((listener) => listener.getVersionId());
};

export const clearDecoratorWatcherState = () => {
    Object.keys(updateListeners).forEach((env) => {
        delete updateListeners[env as DecoratorEnv];
    });
};
