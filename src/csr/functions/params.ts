import { isReady } from "./utils";
import { DecoratorParams } from "../../common/common-types";

export const setParams = (params: DecoratorParams) =>
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
                              {} as Record<string, any>,
                          )
                        : {},
                },
                window.location.origin,
            ),
        )
        .catch((error) => console.warn(error));

export const getParams = async (): Promise<DecoratorParams> => {
    return isReady()
        .then(() => window.__DECORATOR_DATA__.params)
        .catch((error) => {
            console.warn(error);
        });
};
