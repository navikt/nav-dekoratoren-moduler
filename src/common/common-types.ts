export type Locale = "nb" | "nn" | "en" | "se" | "pl" | "uk";

export type Language =
    | {
          url?: string;
          locale: Locale;
          handleInApp: true;
      }
    | {
          url: string;
          locale: Locale;
          handleInApp?: false;
      };

export type Breadcrumb = {
    url: string;
    title: string;
    handleInApp?: boolean;
};

export type Env = "localhost" | "prod" | "dev";

export type NaisEnv = Exclude<Env, "localhost">;

export type Props = Params &
    (
        | { env: NaisEnv }
        | {
              env: "localhost";
              port: number | string;
              dekoratorenUrl?: string;
          }
    );

export interface Params {
    context?: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple?: boolean;
    simpleHeader?: boolean;
    simpleFooter?: boolean;
    enforceLogin?: boolean;
    redirectToApp?: boolean;
    redirectToUrl?: string;
    level?: string;
    language?: Locale;
    availableLanguages?: Language[];
    breadcrumbs?: Breadcrumb[];
    utilsBackground?: "white" | "gray" | "transparent";
    feedback?: boolean;
    chatbot?: boolean;
    chatbotVisible?: boolean;
    taSurveys?: string;
    urlLookupTable?: boolean;
    shareScreen?: boolean;
    utloggingsvarsel?: boolean;
    logoutUrl?: string;
}
