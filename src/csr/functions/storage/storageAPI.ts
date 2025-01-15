import Cookies from "js-cookie";
import { CookieConfig, isStorageKeyAllowed } from "./storageHelpers";

// Cookies
// ------------------------------
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
        return storage.getItem(key);
    },

    setItem(key: string, value: string): void {
        const isAllowed = isStorageKeyAllowed(key);
        if (!isAllowed) {
            console.log("not allowed");
            throw new Error(
                `Storage key ${key} is not in the decorator storage white list and can not be set.`,
            );
        }
        console.log(
            `Setting item ${key} to ${value} storagekeyallowed: ${isStorageKeyAllowed(key)}`,
        );
        storage.setItem(key, value);
    },

    removeItem(key: string): void {
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

// Creating augmented versions for sessionStorage and localStorage
export const navSessionStorage = createStorage(window.sessionStorage);
export const navLocalStorage = createStorage(window.localStorage);
