import Cookies from "js-cookie";

export type Storage = {
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

export type Consent = {
    consent: {
        analytics: boolean;
        surveys: boolean;
    };
    userActionTaken: boolean;
    meta: {
        createdAt: string;
        updatedAt: string;
        version: number;
    };
};

const DECORATOR_DATA_TIMEOUT = 5000;

export const awaitNavWebStorage = async () => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(
                new Error(
                    `Timed out after ${DECORATOR_DATA_TIMEOUT}ms waiting for __DECORATOR_DATA__ to be set. Please check that the decorator is infact loading.`,
                ),
            );
        }, DECORATOR_DATA_TIMEOUT);

        const checkForDecoratorData = () => {
            if (window.__DECORATOR_DATA__ && window.webStorageController) {
                clearTimeout(timeout);
                resolve(true);
            } else {
                setTimeout(checkForDecoratorData, 50);
            }
        };

        checkForDecoratorData();
    });
};

export const isStorageKeyAllowed = (key: string): boolean => {
    return window.webStorageController?.isStorageKeyAllowed(key);
};

export const getAllowedStorage = (): Storage[] => {
    return window.webStorageController?.getAllowedStorage();
};

export const getCurrentConsent = (): Consent => {
    return window.webStorageController?.getCurrentConsent();
};
