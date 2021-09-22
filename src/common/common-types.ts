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

export type ENV = "localhost" | "prod" | "dev" | "q0" | "q1" | "q2" | "q6";

export type Props = Params &
    (
        | { env: Exclude<ENV, "localhost"> }
        | { env: Extract<ENV, "localhost">; port: number | string }
        );

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
    taSurveys?: string;
    urlLookupTable?: boolean;
    shareScreen?: boolean;
    utloggingsvarsel?: boolean;
    logoutUrl?: string;
    dekoratorenUrl?: string
}
