import { Storage } from "./functions/storage/storageHelpers";

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
        dekoratorenAnalytics: ({
            origin,
            eventName,
            eventData,
        }?: {
            origin: string;
            eventName: string;
            eventData?: Record<string, any>;
        }) => Promise<any>;
        __DECORATOR_DATA__: any;
        webStorageController: {
            isStorageKeyAllowed: (key: string) => boolean;
            getAllowedStorage: () => Storage[];
            getCurrentConsent: () => Consent;
        };
    }
}

export {};
