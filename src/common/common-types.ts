export interface Language {
    url: string;
    locale: string;
    handleInApp?: boolean;
}

export interface Breadcrumb {
    url: string;
    title: string;
    handleInApp?: boolean;
}

export type supportedLanguages = "nb" | "nn" | "en" | "se" | "pl";

export interface Params {
    context?: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple?: boolean;
    enforceLogin?: boolean;
    redirectToApp?: boolean;
    level?: string;
    language?: supportedLanguages;
    availableLanguages?: Language[];
    breadcrumbs?: Breadcrumb[];
    utilsBackground?: "white" | "gray" | "transparent";
    feedback?: boolean;
    chatbot?: boolean;
    taSurveys?: string;
    urlLookupTable?: boolean;
    shareScreen?: boolean;
    utloggingsvarsel?: boolean;
    logoutUrl?: string;
}
