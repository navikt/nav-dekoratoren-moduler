export type DecoratorLocale = "nb" | "nn" | "en" | "se" | "pl" | "uk" | "ru";

export type DecoratorLanguageOption =
    | { url?: string; locale: DecoratorLocale; handleInApp: true }
    | { url: string; locale: DecoratorLocale; handleInApp?: false };

export type DecoratorBreadcrumb = {
    url: string;
    title: string;
    analyticsTitle?: string;
    handleInApp?: boolean;
};

export type DecoratorNaisEnv = "prod" | "dev" | "beta" | "betaTms";

export type DecoratorEnv = DecoratorNaisEnv | "localhost";

export type DecoratorEnvProps =
    | { env: "localhost"; localUrl: string }
    | { env: DecoratorNaisEnv; serviceDiscovery?: boolean };

export type DecoratorFetchProps = {
    params?: DecoratorParams;
    noCache?: boolean;
    /**
     * Identifies the consuming team/app to dekoratoren.
     *
     * SSR: only needed as a fallback - the library derives this automatically
     * from the NAIS_APP_NAME/NAIS_NAMESPACE environment variables when running
     * on NAIS.
     *
     * CSR: required, since NAIS environment variables aren't available in the
     * browser.
     */
    teamName?: string;
} & DecoratorEnvProps;

export type DecoratorUrlProps = { csr?: boolean } & DecoratorFetchProps;

export type DecoratorParams = Partial<{
    context: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple: boolean;
    simpleHeader: boolean;
    simpleFooter: boolean;
    redirectToApp: boolean;
    redirectToUrl: string;
    redirectToUrlLogout: string;
    level: string;
    language: DecoratorLocale;
    availableLanguages: DecoratorLanguageOption[];
    breadcrumbs: DecoratorBreadcrumb[];
    utilsBackground: "white" | "gray" | "transparent";
    feedback: boolean;
    chatbot: boolean;
    chatbotVisible: boolean;
    shareScreen: boolean;
    logoutUrl: string;
    logoutWarning: boolean;
    redirectOnUserChange: boolean;
    origin: string;
    pageType: string;
    analyticsQueryParams: string[];
    analyticsRedactFilter: string[];
}>;

export type DecoratorElements = {
    DECORATOR_HEAD_ASSETS: string;
    DECORATOR_HEADER: string;
    DECORATOR_FOOTER: string;
    DECORATOR_SCRIPTS: string;
};
