import type { EventName, PropertiesFor } from "@navikt/analytics-types";
import {
    createAnalyticsMetadata,
    type AnalyticsEntryPoint,
} from "../../common/decorator-moduler-metadata";

export type AnalyticsParams<TName extends EventName = EventName> = {
    origin: string;
    eventName: TName;
    eventData?: PropertiesFor<TName>;
};

export type CustomAnalyticsParams = {
    origin: string;
    eventName: string;
    eventData?: Record<string, unknown>;
};

export type AnalyticsPayload = CustomAnalyticsParams & {
    decoratorModulerAnalyticsEntryPoint: AnalyticsEntryPoint;
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

async function dispatchAnalyticsEvent(params: AnalyticsPayload): Promise<any> {
    if (typeof window === "undefined") {
        return Promise.reject("Analytics is only available in the browser");
    }

    const isValid = await validateAnalyticsFunction();

    if (!isValid) {
        return Promise.reject("Analytics instance not found, it may not have been initialized yet");
    }

    return window.dekoratorenAnalytics(params);
}

export function logAnalyticsEvent<TName extends EventName>(params: AnalyticsParams<TName>): Promise<any> {
    return dispatchAnalyticsEvent({
        ...params,
        eventData: params.eventData as Record<string, unknown> | undefined,
        ...createAnalyticsMetadata("typed"),
    });
}

export function logAnalyticsCustomEvent(params: CustomAnalyticsParams): Promise<any> {
    return dispatchAnalyticsEvent({
        ...params,
        ...createAnalyticsMetadata("custom"),
    });
}

export function getAnalyticsInstance(origin: string) {
    function log<TName extends EventName>(eventName: TName, eventData?: PropertiesFor<TName>) {
        return logAnalyticsEvent({ eventName, eventData, origin });
    }

    log.custom = (eventName: string, eventData?: Record<string, unknown>) =>
        logAnalyticsCustomEvent({ eventName, eventData, origin });

    return log;
}
