import { Storage, Consent } from "./functions/storage/storageHelpers";
import type { AnalyticsParams } from "./functions/analytics";

declare global {
    interface Window {
        dekoratorenAnalytics: (params: AnalyticsParams) => Promise<any>;
        __DECORATOR_DATA__: any;
        webStorageController: {
            isStorageKeyAllowed: (key: string) => boolean;
            getAllowedStorage: () => Storage[];
            getCurrentConsent: () => Consent;
        };
    }
}

export {};
