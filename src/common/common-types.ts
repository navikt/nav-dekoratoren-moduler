type Pathname = `/${string}`;
type Localhost = `${"http" | "https"}://localhost${`:${number}` | ""}`;
type NavHostname = `https://${`${string}.nav.no`}`;
type ValidAbsoluteUrl = `${Localhost | NavHostname}${Pathname | ""}`;

export type ValidUrl = Pathname | ValidAbsoluteUrl;

export type Locale = "nb" | "nn" | "en" | "se" | "pl";

export type Language =
  | {
      url?: ValidUrl;
      locale: Locale;
      handleInApp: true;
    }
  | {
      url: ValidUrl;
      locale: Locale;
      handleInApp?: false;
    };

export type Breadcrumb = {
  url: ValidUrl;
  title: string;
  handleInApp?: boolean;
};

export type Env = "localhost" | "prod" | "dev" | "q0" | "q1" | "q2" | "q6";

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
  enforceLogin?: boolean;
  redirectToApp?: boolean;
  redirectToUrl?: ValidUrl;
  level?: string;
  language?: Locale;
  availableLanguages?: Language[];
  breadcrumbs?: Breadcrumb[];
  utilsBackground?: "white" | "gray" | "transparent";
  feedback?: boolean;
  chatbot?: boolean;
  taSurveys?: string;
  urlLookupTable?: boolean;
  shareScreen?: boolean;
  utloggingsvarsel?: boolean;
  logoutUrl?: ValidUrl;
}
