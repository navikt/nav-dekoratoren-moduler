import Cookies from "js-cookie";
import { CookieConfig, isStorageKeyAllowed } from "./storageHelpers";

// Cookies
// ------------------------------
export const setNavCookie = (name: string, value: string, options?: CookieConfig) => {
    if (!isStorageKeyAllowed(name)) {
        console.warn(`The key ${name} is not in the allow list or user has not given consent.`);
        return null;
    }

    return Cookies.set(name, value, options);
};

export const getNavCookie = (name: string) => {
    if (!isStorageKeyAllowed(name)) {
        console.warn(`The key ${name} is not in the allow list or user has not given consent.`);
        return null;
    }
    return Cookies.get(name);
};

// LocalStorage
// ------------------------------

interface StorageAPI {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
    key(index: number): string | null;
    length: number;
}

const createStorage = (storage: Storage): StorageAPI => ({
    getItem(key: string): string | null {
        if (!isStorageKeyAllowed(key)) {
            console.warn(`The key ${key} is not in the allow list or user has not given consent.`);
            return null;
        }
        return storage.getItem(key);
    },

    setItem(key: string, value: string): string | null {
        if (!isStorageKeyAllowed(key)) {
            console.warn(`The key ${key} is not in the allow list or user has not given consent.`);
            return null;
        }
        storage.setItem(key, value);
        return value;
    },

    removeItem(key: string): void | null {
        if (!isStorageKeyAllowed(key)) {
            console.warn(`The key ${key} is not in the allow list or user has not given consent.`);
            return null;
        }
        storage.removeItem(key);
    },

    clear(): void {
        storage.clear();
    },

    key(index: number): string | null {
        return storage.key(index);
    },

    get length(): number {
        return storage.length;
    },
});

export const createLocalStorage = () => {
    if (typeof window === "undefined") {
        return null;
    }
    return createStorage(window.localStorage);
};

export const createSessionStorage = () => {
    if (typeof window === "undefined") {
        return null;
    }
    return createStorage(window.sessionStorage);
};
// Creating augmented versions for sessionStorage and localStorage
export const navSessionStorage = createSessionStorage();
export const navLocalStorage = createLocalStorage();
