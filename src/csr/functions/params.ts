import { isReady } from "./utils";
import { Params } from "../../common/common-types";

export const setParams = (params: Params) =>
    isReady()
        .then(() =>
            window.postMessage(
                {
                    source: "decoratorClient",
                    event: "params",
                    payload: params
                        ? Object.entries(params).reduce(
                              (acc, [key, value]) =>
                                  value !== undefined
                                      ? {
                                            ...acc,
                                            [key]: value,
                                        }
                                      : acc,
                              {} as Record<string, any>
                          )
                        : {},
                },
                window.location.origin
            )
        )
        .catch((error) => console.warn(error));
