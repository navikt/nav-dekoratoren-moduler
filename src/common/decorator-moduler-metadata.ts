import type { DecoratorParams } from "./common-types";

export type EntryPoint = "ssr" | "csr";
export type AnalyticsEntryPoint = "typed" | "custom" | "legacy";

export type ParamsWithMetadata = DecoratorParams & {
    decoratorModulerVersion?: string;
    decoratorModulerEntryPoint?: EntryPoint;
    decoratorModulerBuildTime?: true;
};

const version = "__NAV_DEKORATOREN_MODULER_VERSION__";

let hasWarnedMissingConsumerIdentity = false;
let hasWarnedInvalidConsumerIdentity = false;
let hasWarnedBuildTime = false;

const isValidTeamName = (teamName: string) =>
    /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(teamName);

// Next.js sets NEXT_PHASE before it spawns the workers that prerender pages
const isNextBuild = () =>
    typeof process !== "undefined" &&
    process.env?.NEXT_PHASE === "phase-production-build";

const warnBuildTimeOnce = () => {
    if (hasWarnedBuildTime) {
        return;
    }
    hasWarnedBuildTime = true;
    console.warn(
        "[nav-dekoratoren-moduler] Dekoratøren hentes under next build. Sider som genereres statisk, " +
            "fryser Dekoratøren (HTML, CSS og versjon) frem til neste deploy av appen, og sender ikke teamName. " +
            "Bruk dynamisk rendering for sider med Dekoratøren: " +
            "https://github.com/navikt/nav-dekoratoren#unnga-statisk-generering",
    );
};

const getNaisConsumerMetadata = (entryPoint: EntryPoint, teamName?: string) => {
    let candidate = teamName;

    if (entryPoint === "csr") {
        if (!teamName && !hasWarnedMissingConsumerIdentity) {
            hasWarnedMissingConsumerIdentity = true;
            console.warn(
                "[nav-dekoratoren-moduler] Dekoratøren kan ikke identifisere teamet ditt for CSR-forespørsler. " +
                    'Legg til params: { teamName: "<app>.<namespace>" } i injectDecoratorClientSide.',
            );
        }
    } else {
        const { NAIS_APP_NAME, NAIS_NAMESPACE } =
            typeof process !== "undefined" ? process.env : {};

        if (NAIS_APP_NAME && NAIS_NAMESPACE) {
            candidate = `${NAIS_APP_NAME}.${NAIS_NAMESPACE}`;
        } else if (!isNextBuild() && !hasWarnedMissingConsumerIdentity) {
            // During next build the build time warning in withMetadata covers this
            hasWarnedMissingConsumerIdentity = true;
            console.warn(
                "[nav-dekoratoren-moduler] NAIS_APP_NAME eller NAIS_NAMESPACE er ikke satt — " +
                    "bruker params.teamName som fallback dersom den er satt.",
            );
        }
    }

    if (candidate && !isValidTeamName(candidate) && !hasWarnedInvalidConsumerIdentity) {
        hasWarnedInvalidConsumerIdentity = true;
        console.warn(
            "[nav-dekoratoren-moduler] teamName har ugyldig format. Bruk app.namespace med små bokstaver," +
                " tall, bindestrek og minst ett punktum.",
        );
    }

    return candidate && isValidTeamName(candidate) ? { teamName: candidate } : {};
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
): ParamsWithMetadata => {
    const { teamName, ...otherParams } = params ?? {};
    const isBuildTime = entryPoint === "ssr" && isNextBuild();
    if (isBuildTime) {
        warnBuildTimeOnce();
    }

    return {
        ...otherParams,
        ...createMetadata(entryPoint),
        ...getNaisConsumerMetadata(entryPoint, teamName),
        ...(isBuildTime ? { decoratorModulerBuildTime: true as const } : {}),
    };
};
