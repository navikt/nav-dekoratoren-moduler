import { msgSafetyCheck } from "./utils";
import { setParams } from "./params";
import { DecoratorBreadcrumb } from "../../common/common-types";

export const onBreadcrumbClick = (() => {
    let callback: (breadcrumb: DecoratorBreadcrumb) => void;

    const receiveMessage = (msg: MessageEvent) => {
        const { data } = msg;
        const isSafe = msgSafetyCheck(msg);
        const { source, event, payload } = data;
        if (isSafe) {
            if (
                source === "decorator" &&
                event === "breadcrumbClick" &&
                callback
            ) {
                callback(payload);
            }
        }
    };

    if (typeof window !== "undefined") {
        window.addEventListener("message", receiveMessage);
    }

    return (_callback: (breadcrumb: DecoratorBreadcrumb) => void) => {
        callback = _callback;
    };
})();

export const setBreadcrumbs = (breadcrumbs: DecoratorBreadcrumb[]) =>
    setParams({ breadcrumbs });
