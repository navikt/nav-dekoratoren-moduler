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

const getNaisConsumerMetadata = (entryPoint: EntryPoint) => {
    if (typeof process === "undefined") return {};
    if (!process.env.NAIS_APP_NAME && !hasWarnedMissingConsumerIdentity) {
        hasWarnedMissingConsumerIdentity = true;
        if (entryPoint === "csr") {
            console.warn(
                "[nav-dekoratoren-moduler] Dekoratøren kan ikke identifisere teamet ditt for CSR-forespørsler. " +
                    'Legg til headeren "X-Teamname: <teamnavn>" i forespørslene til dekoratøren for å bli ' +
                    "identifisert i logger og feilmeldinger.",
            );
        } else if (entryPoint === "ssr") {
            console.warn(
                "[nav-dekoratoren-moduler] NAIS_APP_NAME ikke satt — SSR-forespørsler kan ikke knyttes til et team.",
            );
        }
    }
    return {
        ...(process.env.NAIS_APP_NAME && { naisAppName: process.env.NAIS_APP_NAME }),
        ...(process.env.NAIS_NAMESPACE && { naisNamespace: process.env.NAIS_NAMESPACE }),
    };
};

export const createMetadata = (entryPoint: EntryPoint) => ({
    decoratorModulerVersion: version,
    decoratorModulerEntryPoint: entryPoint,
});

export const createAnalyticsMetadata = (analyticsEntryPoint: AnalyticsEntryPoint) => ({
    decoratorModulerAnalyticsEntryPoint: analyticsEntryPoint,
});

export const withMetadata = (
    params: DecoratorParams | undefined,
    entryPoint: EntryPoint,
): ParamsWithMetadata => ({
    ...params,
    ...createMetadata(entryPoint),
    ...getNaisConsumerMetadata(entryPoint),
});
