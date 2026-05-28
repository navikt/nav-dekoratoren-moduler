import { Storage, Consent } from "./functions/storage/storageHelpers";
import type { AnalyticsEntryPoint } from "../common/decorator-moduler-metadata";

type AnalyticsPayload = {
    origin: string;
    eventName: string;
    eventData?: Record<string, any>;
    decoratorModulerAnalyticsEntryPoint?: AnalyticsEntryPoint;
};

declare global {
    interface Window {
        dekoratorenAmplitude: ({
            origin,
            eventName,
            eventData,
        }?: {
            origin: string;
            eventName: string;
            eventData?: Record<string, any>;
        }) => Promise<any>;
        dekoratorenAnalytics: (params?: AnalyticsPayload) => Promise<any>;
        __DECORATOR_DATA__: any;
        webStorageController: {
            isStorageKeyAllowed: (key: string) => boolean;
            getAllowedStorage: () => Storage[];
            getCurrentConsent: () => Consent;
        };
    }
}

export {};
