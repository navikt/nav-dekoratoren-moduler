import { AnalyticsEvent, AnalyticsEvents } from "../events";

export type AnalyticsParams = {
    origin: string;
    eventName: string;
    eventData?: Record<string, any>;
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

export type AutocompleteString = string & {};
export type AnalyticsEventName = AnalyticsEvents["name"];
export type AutocompleteEventName = AnalyticsEventName | AutocompleteString;

export async function logAnalyticsEvent<TName extends AnalyticsEventName>(params: {
    eventName: TName | AutocompleteString;
    eventData?: TName extends AnalyticsEventName
        ? Extract<AnalyticsEvents, { name: TName }>["properties"]
        : Record<string, any>;
    origin: string;
}): Promise<any> {
    if (typeof window === "undefined") {
        return Promise.reject("Analytics is only available in the browser");
    }

    const isValid = await validateAnalyticsFunction();

    if (!isValid) {
        return Promise.reject("Analytics instance not found, it may not have been initialized yet");
    }

    return window.dekoratorenAnalytics(params);
}

export function getAnalyticsInstance<
    TCustomEvents extends AnalyticsEvent<string, Record<string, unknown>> = any,
>(origin: string) {
    return <TName extends AutocompleteEventName>(
        // Can be set to never if we want to be more strict
        eventName: TName extends AnalyticsEventName
            ? TName
            : TName extends TCustomEvents["name"]
              ? TName
              : TName,
        eventData?: TName extends AnalyticsEventName
            ? Extract<AnalyticsEvents, { name: TName }>["properties"]
            : TName extends TCustomEvents["name"]
              ? Extract<TCustomEvents, { name: TName }>["properties"]
              : Record<string, any>,
    ) => {
        return logAnalyticsEvent({
            eventName,
            eventData,
            origin,
        });
    };
}
