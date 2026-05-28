import type { DecoratorParams } from "./common-types";

export type EntryPoint = "ssr" | "csr";
export type AnalyticsEntryPoint = "typed" | "custom" | "legacy";

export type ParamsWithMetadata = DecoratorParams & {
    decoratorModulerVersion?: string;
    decoratorModulerEntryPoint?: EntryPoint;
};

const version = "__NAV_DEKORATOREN_MODULER_VERSION__";

export const createMetadata = (entryPoint: EntryPoint) => ({
    decoratorModulerVersion: version,
    decoratorModulerEntryPoint: entryPoint,
});

export const createAnalyticsMetadata = (
    analyticsEntryPoint: AnalyticsEntryPoint,
) => ({
    decoratorModulerAnalyticsEntryPoint: analyticsEntryPoint,
});

export const withMetadata = (
    params: DecoratorParams | undefined,
    entryPoint: EntryPoint,
): ParamsWithMetadata => ({
    ...params,
    ...createMetadata(entryPoint),
});
