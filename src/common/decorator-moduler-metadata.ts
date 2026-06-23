import type { DecoratorParams } from "./common-types";

export type EntryPoint = "ssr" | "csr";
export type AnalyticsEntryPoint = "typed" | "custom" | "legacy";

export type ParamsWithMetadata = DecoratorParams & {
    decoratorModulerVersion?: string;
    decoratorModulerEntryPoint?: EntryPoint;
    naisAppName?: string;
    naisNamespace?: string;
};

const version = "__NAV_DEKORATOREN_MODULER_VERSION__";

let hasWarnedMissingConsumerIdentity = false;

const getNaisConsumerMetadata = (entryPoint: EntryPoint, teamName?: string) => {
    if (typeof process === "undefined") {
        if (!teamName && !hasWarnedMissingConsumerIdentity) {
            hasWarnedMissingConsumerIdentity = true;
            console.warn(
                "[nav-dekoratoren-moduler] Dekoratøren kan ikke identifisere teamet ditt for CSR-forespørsler. " +
                    'Legg til "teamName: <teamnavn>" i konfigurasjonen til injectDecoratorClientSide.',
            );
        }
        return teamName ? { naisAppName: teamName } : {};
    }
    if (
        entryPoint === "ssr" &&
        !process.env.NAIS_APP_NAME &&
        !hasWarnedMissingConsumerIdentity
    ) {
        hasWarnedMissingConsumerIdentity = true;
        console.warn(
            "[nav-dekoratoren-moduler] NAIS_APP_NAME ikke satt — SSR-forespørsler kan ikke knyttes til et team.",
        );
    }
    return {
        ...(process.env.NAIS_APP_NAME && {
            naisAppName: process.env.NAIS_APP_NAME,
        }),
        ...(teamName &&
            !process.env.NAIS_APP_NAME && { naisAppName: teamName }),
        ...(process.env.NAIS_NAMESPACE && {
            naisNamespace: process.env.NAIS_NAMESPACE,
        }),
    };
};

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
    teamName?: string,
): ParamsWithMetadata => ({
    ...params,
    ...createMetadata(entryPoint),
    ...getNaisConsumerMetadata(entryPoint, teamName),
});
