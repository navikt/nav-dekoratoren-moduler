export type AmplitudeParams = {
    appName: string;
    eventName: string;
    eventData?: Record<string, any>;
};

export const logAmplitudeEvent = (params: AmplitudeParams): Promise<any> => {
    if (typeof window === "undefined") {
        return Promise.reject("Amplitude is only available in the browser");
    }

    if (typeof window.dekoratorenAmplitude !== "function") {
        return Promise.reject(
            "Amplitude instance not found, it may not have been initialized yet"
        );
    }

    return window.dekoratorenAmplitude(params);
};
