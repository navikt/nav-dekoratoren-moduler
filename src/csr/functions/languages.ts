import { msgSafetyCheck } from "./utils";
import { setParams } from "./params";
import { Language } from "../../common/common-types";

export const onLanguageSelect = (() => {
    let callback: (language: Language) => void;

    const receiveMessage = (msg: MessageEvent) => {
        const { data } = msg;
        const isSafe = msgSafetyCheck(msg);
        const { source, event, payload } = data;
        if (isSafe) {
            if (
                source === "decorator" &&
                event === "languageSelect" &&
                callback
            ) {
                callback(payload);
            }
        }
    };

    if (typeof window !== "undefined") {
        window.addEventListener("message", receiveMessage);
    }

    return (_callback: (language: Language) => void) => {
        callback = _callback;
    };
})();

export const setAvailableLanguages = (availableLanguages: Language[]) =>
    setParams({ availableLanguages });
