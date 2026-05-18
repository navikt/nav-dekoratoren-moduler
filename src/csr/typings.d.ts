import { Storage, Consent } from "./functions/storage/storageHelpers";
import type { CustomAnalyticsParams } from "./functions/analytics";

declare global {
    interface Window {
        dekoratorenAnalytics: (params: CustomAnalyticsParams) => Promise<any>;
        __DECORATOR_DATA__: any;
        webStorageController: {
            isStorageKeyAllowed: (key: string) => boolean;
            getAllowedStorage: () => Storage[];
            getCurrentConsent: () => Consent;
        };
    }
}

export {};
