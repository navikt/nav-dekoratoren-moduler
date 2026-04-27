import type { EventName, PropertiesFor } from "@navikt/analytics-types";

export type AnalyticsParams<TName extends EventName = EventName> = {
    origin: string;
    eventName: TName;
    eventData?: PropertiesFor<TName>;
};

const waitForRetry = async () => new Promise((resolve) => setTimeout(resolve, 500));

const validateAnalyticsFunction = async (retries = 5): Promise<boolean> => {
    if (typeof window.dekoratorenAnalytics === "function") {
        return Promise.resolve(true);
    }

    if (retries === 0) {
        return Promise.resolve(false);
    }

    await waitForRetry();

    return validateAnalyticsFunction(retries - 1);
};

export async function logAnalyticsEvent<TName extends EventName>(
    params: AnalyticsParams<TName>,
): Promise<any> {
    if (typeof window === "undefined") {
        return Promise.reject("Analytics is only available in the browser");
    }

    const isValid = await validateAnalyticsFunction();

    if (!isValid) {
        return Promise.reject("Analytics instance not found, it may not have been initialized yet");
    }

    return window.dekoratorenAnalytics(params);
}

export function getAnalyticsInstance(origin: string) {
    return <TName extends EventName>(
        eventName: TName,
        eventData?: PropertiesFor<TName>,
    ) => {
        return logAnalyticsEvent<TName>({
            eventName,
            eventData,
            origin,
        });
    };
}
