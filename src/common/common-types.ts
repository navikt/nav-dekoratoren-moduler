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

export interface Params {
    context?: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple?: boolean;
    enforceLogin?: boolean;
    redirectToApp?: boolean;
    level?: string;
    language?: "nb" | "nn" | "en" | "se" | "pl";
    availableLanguages?: Language[];
    breadcrumbs?: Breadcrumb[];
    utilsBackground?: "white" | "gray" | "transparent";
    feedback?: boolean;
    chatbot?: boolean;
    urlLookupTable?: boolean;
    shareScreen?: boolean;
    utloggingsvarsel?: boolean;
}
