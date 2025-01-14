import Cookies from "js-cookie";

export type PublicStorageItem = {
    name: string;
    type: "cookie" | "localstorage" | "sessionstorage";
    optional: boolean;
};

export type CookieConfig = {
    expires?: number | Date | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    secure?: boolean | undefined;
    sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None" | undefined;
};

const DECORATOR_DATA_TIMEOUT = 5000;

const getStorageDictionaryFromEnv = (): PublicStorageItem[] => {
    if (!window.__DECORATOR_DATA__) {
        throw new Error(
            "Decorator data not available. Use the async 'isDecoratorDataAvailable' function to await for the data is available.",
        );
    }
    return window.__DECORATOR_DATA__.allowedStorage || [];
};

export const awaitDecoratorData = async () => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(
                new Error(
                    `Timed out after ${DECORATOR_DATA_TIMEOUT}ms waiting for __DECORATOR_DATA__ to be set. Please check that the decorator is infact loading.`,
                ),
            );
        }, DECORATOR_DATA_TIMEOUT);

        const checkForDecoratorData = () => {
            if (window.__DECORATOR_DATA__) {
                clearTimeout(timeout); // Clear the timeout if the data is set
                resolve(true);
            } else {
                setTimeout(checkForDecoratorData, 50); // Check every 50ms
            }
        };

        checkForDecoratorData(); // Start checking
    });
};

export const isStorageKeyAllowed = (key: string) => {
    const storageDictionary = getStorageDictionaryFromEnv();
    const isAllowed = storageDictionary.some((allowedItem) => {
        const baseName = key.split(/[-*]/)[0];
        return allowedItem.name.startsWith(baseName);
    });

    return isAllowed;
};

export const getAllowedStorage = () => {
    const storageDictionary = getStorageDictionaryFromEnv();
    return Array.from(storageDictionary);
};

export const getCurrentConsent = () => {
    const allCookies = document.cookie.split("; ");
    const consentCookies = allCookies
        .filter((cookie) => cookie.startsWith("navno-consent"))
        .sort((a, b) => {
            if (typeof a !== "string" || typeof b !== "string") {
                return 0;
            }
            const numA = parseInt(a.split("-")[2]);
            const numB = parseInt(b.split("-")[2]);
            return numB - numA;
        });
    return consentCookies.length > 0 ? consentCookies[0] : null;
};
