export type AmplitudeParams = {
    origin: string;
    eventName: string;
    eventData?: Record<string, any>;
};

const waitForRetry = async () =>
    new Promise((resolve) => setTimeout(resolve, 500));

const validateAmplitudeFunction = async (retries = 5): Promise<boolean> => {
    if (typeof window.dekoratorenAmplitude === "function") {
        return Promise.resolve(true);
    }

    if (retries === 0) {
        return Promise.resolve(false);
    }

    await waitForRetry();

    return validateAmplitudeFunction(retries - 1);
};

export const logAmplitudeEvent = async (
    params: AmplitudeParams
): Promise<any> => {
    if (typeof window === "undefined") {
        return Promise.reject("Amplitude is only available in the browser");
    }

    const isValid = await validateAmplitudeFunction();

    if (!isValid) {
        return Promise.reject(
            "Amplitude instance not found, it may not have been initialized yet"
        );
    }

    return window.dekoratorenAmplitude(params);
};
