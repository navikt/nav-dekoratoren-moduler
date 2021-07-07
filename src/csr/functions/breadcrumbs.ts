import { msgSafetyCheck } from "./utils";
import { setParams } from "./params";
import { Breadcrumb } from "../../common-types";

export const onBreadcrumbClick = (() => {
  let callback: (breadcrumb: Breadcrumb) => void;

  const receiveMessage = (msg: MessageEvent) => {
    const { data } = msg;
    const isSafe = msgSafetyCheck(msg);
    const { source, event, payload } = data;
    if (isSafe) {
      if (source === "decorator" && event === "breadcrumbClick" && callback) {
        callback(payload);
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("message", receiveMessage);
  }

  return (_callback: (breadcrumb: Breadcrumb) => void) => {
    callback = _callback;
  };
})();

export const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) =>
  setParams({ breadcrumbs });
