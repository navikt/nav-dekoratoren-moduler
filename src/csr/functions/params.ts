import { isReady } from "./utils";
import { Params } from "../../common/common-types";

export const setParams = (params: Params) =>
  isReady()
    .then(() =>
      window.postMessage(
        {
          source: "decoratorClient",
          event: "params",
          payload: params,
        },
        window.location.origin
      )
    )
    .catch((error) => console.warn(error));
