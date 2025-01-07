// import Cookies from "js-cookie";

type StorageConfig = {
    type: "cookie" | "localStorage" | "sessionStorage";
    key: string;
    requireConsent: boolean;
};

const storageDictionary: Set<StorageConfig> = new Set([
    {
        type: "cookie",
        key: "ta-dekoratoren-v2",
        requireConsent: true,
    },
]);

const isStorageKeyAllowed = (key: string) => {
    return Array.from(storageDictionary).some((config) => config.key === key);
};

export const setNavCookie = (name: string, value: string, options?: any) => {
    if (!isStorageKeyAllowed(name)) {
        throw new Error(
            `Storage key ${name} is not in the decorator white list and can not be set.`,
        );
    }

    // Cookies.set(name, value, options);
};

export const getNavCookie = (name: string) => {
    return null; //Cookies.get(name);
};
