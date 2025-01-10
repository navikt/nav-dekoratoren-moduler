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

const getStorageDictionaryFromEnv = (): Promise<PublicStorageItem[]> => {
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
                resolve(window.__DECORATOR_DATA__.allowedStorage || []);
            } else {
                setTimeout(checkForDecoratorData, 50); // Check every 50ms
            }
        };

        checkForDecoratorData(); // Start checking
    });
};

export const isStorageKeyAllowed = async (key: string) => {
    const storageDictionary = await getStorageDictionaryFromEnv();
    return Array.from(storageDictionary).some((item) => {
        const startOfName = item.name.split("*")[0];
        return key.startsWith(startOfName);
    });
};

export const getAllowedStorage = async () => {
    const storageDictionary = await getStorageDictionaryFromEnv();
    return Array.from(storageDictionary);
};

export const setNavCookie = (name: string, value: string, options?: CookieConfig) => {
    if (!isStorageKeyAllowed(name)) {
        throw new Error(
            `Storage key ${name} is not in the decorator white list and can not be set.`,
        );
    }

    Cookies.set(name, value, options);
};

export const getNavCookie = (name: string) => {
    return Cookies.get(name);
};
