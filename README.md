# nav-dekoratoren-moduler

> NPM-pakke med hjelpefunksjoner for [Nav-dekoratøren](https://github.com/navikt/decorator-next) (header og footer på nav.no)

## Changelog

### 3.2.3

- Eksporterer `getAnalyticsInstance`-funksjonen som erstatter `getAmplitudeInstance`

### 3.2.2

- Tar imot logging fra amplitude og forkaster hvis dekoratorenAmplitude ikke finnes. Dette er en justering fra tidligere hvor getAmplitudeInstance returnerte rejected promise.

### 3.2.1

- Eksporterer nye analyticsfunksjoner som logger både umami + amplitude

### 3.2.0

- Ny funksjonalitet for å sette cookies, localStorage og sessionStorage basert på tillatte lagring. Se egen seksjon for mer info.

### 3.1.3

- Oppdaterer avhengigheter, kun patch.

### 3.1.2

- Legger til `pageType` i params. Kan brukes til å logge sidetype til Analytics/Amplitude

### 3.1.1

- Legger til `redirectOnUserChange` i params

### 3.1

- Legger til prop for egendefinert komponent for `script`-elementer fra `fetchDecoratorReact`. Skal nå støtte bruk i next.js app-router layouts, se [fetchDecoratorReact](#fetchdecoratorreact).
- Peer dependencies er ikke lengre optional (med unntak av React).

### 3.0

- Server-side fetch-funksjoner henter nå ferdige HTML-fragmenter fra `/ssr`-endepunktet, istedenfor å parse hele dekoratørens HTML.
- (breaking) Alle dekoratørens `<head>`-elementer er nå inkludert i det påkrevde fragmentet `DECORATOR_HEAD_ASSETS`. CSS, favicon, etc.
- (breaking) Fjerner `DECORATOR_STYLES`/`Styles` fra responsen for `fetchDecoratorHtml`/`fetchDecoratorReact` (erstattes av `DECORATOR_HEAD_ASSETS`).
- Den innbygde cachen av dekoratørens elementer invalideres nå automatisk når en ny versjon av dekoratøren er tilgjengelig.
- Nye funksjoner: `addDecoratorUpdateListener`, `removeDecoratorUpdateListener`, `getDecoratorVersionId`. Tiltenkt brukt for cache-invalidering i apper som cacher dekoratøren på andre måter.
- Fjerner typer for ubrukte parametre `urlLookupTable` og `enforceLogin`
- (breaking) Fjerner `<EnforceLoginLoader/>`
- (breaking) Fjerner `injectDecoratorServerSideDom`. Denne erstattes av `injectDecoratorServerSideDocument`, som tar inn et standard Document DOM-objekt.
- (breaking) Fjerner `getUrlFromLookupTable` og tilhørende url-mappinger
- (breaking) Fjerner `parseDecoratorHTMLToReact`
- (breaking) Alle dependencies er nå optional peer dependencies

### 2.0

- (breaking) Node.js v18 eller nyere er påkrevd, ettersom vi ikke lengre benytter node-fetch. (Node 18 har fetch innebygd)
- (breaking) Server-side fetch-funksjoner benytter nå [service discovery](#service-discovery) som default. Dette krever visse [access policy](#access-policy) regler.
- (breaking) Parametre til fetch-funksjoner er endret, slik at query-parametre til dekoratøren nå er et separat objekt.<br/>
  Eksempel 1.x -> 2.0: `{ env: "prod", context: "arbeidsgiver", simple: true}` -> `{ env: "prod", params: { context: "arbeidsgiver", simple: true }}`)
- (breaking) Ved bruk av `env: "localhost"` må dekoratørens url nå alltid settes med parameteret `localUrl`. Dette erstatter parameterene `port` og `dekoratorenUrl`, og vi har ikke lengre en default localhost url.
- Flere typer er endret eller har fått mer spesifikke navn (f.eks. `Params` -> `DecoratorParams`)

## Kom i gang

```
npm install --save @navikt/nav-dekoratoren-moduler
```

Obs! Oppdaterte pakker publiseres kun i GitHub Packages registry'et. For å kunne installere nyere versjoner må pakker fra @navikt-orgen scopes til GitHub Packages.

#### Ved lokal kjøring:

- Legg til dette i `.npmrc`-fila for prosjektet. Opprett fila på rot i prosjektet hvis den ikke finnes.

```
@navikt:registry=https://npm.pkg.github.com
```

- Opprett et PAT med `read:packages` scope og SSO auth, og bruk dette som passord ved login.

```
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

#### Ved bygg på Github Actions:

- Sett registry url med f.eks. `actions/setup-node`:

```
- name: Setup node.js
  uses: actions/setup-node@v4
  with:
    registry-url: 'https://npm.pkg.github.com'
```

- Sett `NODE_AUTH_TOKEN` på `npm ci`. `READER_TOKEN` er en navikt org-wide secret til dette formålet.

```
- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.READER_TOKEN }}
```

# Hente dekoratøren

Pakka inneholder funksjoner for å laste inn dekoratøren i apper på ulike måter.

Samtlige funksjoner for fetch av dekoratøren tar inn parametre med følgende type:

```tsx
type DecoratorNaisEnv =
    | "prod" // For produksjons-instans av dekoratøren
    | "dev" // For stabil dev-instans
    | "beta" // Beta dev-instanser er ment for internt test-bruk
    | "betaTms"; // Disse kan være ustabile i lengre perioder

type DecoratorEnvProps =
    // Dersom env er satt til localhost, må du selv sette url for dekoratøren.
    | { env: "localhost"; localUrl: string }
    // For nais-miljøer settes url automatisk
    | { env: DecoratorNaisEnv; serviceDiscovery?: boolean };

type DecoratorFetchProps = {
    // Query-parametre til dekoratøren, se dekoratørens readme for dokumentasjon
    params?: DecoratorParams;
} & DecoratorEnvProps;
```

### Service discovery

Server-side fetch-funksjonene benytter [service discovery](https://docs.nais.io/clusters/service-discovery) som default.
Vær obs på at dette kun fungerer ved kjøring på dev-gcp eller prod-gcp nais-clusterne. Dersom appen ikke kjører i ett av disse clusterne, vil vi falle tilbake til å kalle eksterne ingresser.

Du kan også sette parameteret `serviceDiscovery: false` for å alltid benytte eksterne ingresser.

```tsx
fetchDecoratorHtml({
    env: "prod",
    serviceDiscovery: false,
});
```

### Access policy

Se [nais doc](https://docs.nais.io/nais-application/access-policy) for oppsett av access policy.

#### Service discovery (default)

Ved bruk av service discovery må følgende regel inkluderes i access policy:

```yaml
accessPolicy:
    outbound:
        rules:
            - application: nav-dekoratoren
              namespace: personbruker
```

#### Eksterne ingresser

Dersom service discovery ikke benyttes, vil dekoratørens eksterne ingresser kalles. Dette gjelder ved bruk av versjon 1.9 eller tidligere, eller dersom `serviceDiscovery: false` er satt.

Følgende access policy kreves:

```yaml
accessPolicy:
    outbound:
        external:
            - host: www.nav.no # for prod
            - host: dekoratoren.ekstern.dev.nav.no # for dev
```

## Server side rendering (anbefalt)

Server-side rendering av dekoratøren anbefales for optimal brukeropplevelse. Dersom kallet feiler (etter 3 retries), faller vi tilbake til statiske placeholder-elementer som client-side rendres.

### injectDecoratorServerSide

Parser en HTML-fil med JSDOM og returnerer en HTML-string som inkluderer dekoratøren. Krever at `jsdom >=16.x` er installert.

```tsx
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSide({
    env: "prod",
    filePath: "index.html",
    params: { context: "privatperson", simple: true },
}).then((htmlWithDecorator: string) => {
    res.send(htmlWithDecorator);
});
```

### injectDecoratorServerSideDocument

Setter inn dekoratøren i et Document DOM-objekt. Objektet i document-parameteret muteres.

```tsx
import { injectDecoratorServerSideDocument } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSideDocument({
    env: "prod",
    document: myDocument,
    params: { context: "privatperson", simple: true },
}).then((document: Document) => {
    const html = document.documentElement.outerHTML;
    res.send(html);
});
```

### fetchDecoratorHtml

Henter dekoratøren som HTML-fragmenter.

Eksempel på bruk:

```tsx
import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";

const fragments = await fetchDecoratorHtml({
    env: "dev",
    params: { context: "privatperson" },
});

const { DECORATOR_HEAD_ASSETS, DECORATOR_HEADER, DECORATOR_FOOTER, DECORATOR_SCRIPTS } = fragments;

// Sett inn fragmenter i app-html'en med f.eks. en template engine
```

### fetchDecoratorReact

Henter dekoratøren som React-komponenter. Kan benyttes med React rammeverk som støtter server-side rendering. Krever at `react >=17.x` og `html-react-parser >=5.x` er installert.

Ved behov kan det settes en egendefinert komponent for `<script>`-elementer i `<Decorator.Scripts>`. Denne vil erstatte standard `<script>`-tags i parser'en. Ved bruk av next.js app-router kan `next/script` benyttes her, se eksempel #2.

<br/>

#### Med next.js page router

Settes inn i `pages/_document.tsx`:

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

class MyDocument extends Document<DocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        const Decorator = await fetchDecoratorReact({
            env: "prod",
            params: { language: "no", context: "arbeidsgiver" },
        });

        return { ...initialProps, Decorator };
    }

    render() {
        const { Decorator } = this.props;

        return (
            <Html lang={"no"}>
                <Head>
                    <Decorator.HeadAssets />
                </Head>
                <body>
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
```

<br/>

#### Med next.js app router

Settes inn i root layout med `next/script` loader:

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const Decorator = await fetchDecoratorReact({
        env: "prod",
    });

    return (
        <html lang="no">
            <head>
                <Decorator.HeadAssets />
            </head>
            <body>
                <Decorator.Header />
                {children}
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
};

export default RootLayout;
```

## Client-side rendering

CSR vil gi en redusert brukeropplevelse pga layout-shifting/"pop-in" når headeren rendres, og bør unngås om mulig. Ta gjerne kontakt i #dekoratøren_på_navno for bistand med å sette opp SSR i appen din!

### injectDecoratorClientSide

Setter inn dekoratøren i DOM'en client-side. Service discovery kan ikke benyttes ved client-side injection.

Eksempel på bruk:

```tsx
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";

injectDecoratorClientSide({
    env: "prod",
    params: {
        simple: true,
        chatbot: true,
    },
});
```

## Bruk med egendefinert dekoratør-url.

Dersom `env` er satt til `localhost` må dekoratørens URL settes med parametret `localUrl`. Benyttes dersom du f.eks. kjører dekoratøren lokalt på egen maskin, eller den hentes via en proxy.

Eksempel:

```tsx
injectDecoratorServerSide({
    filePath: "index.html",
    env: "localhost",
    localUrl: "http://localhost:8089/dekoratoren",
});
```

# Andre hjelpefunksjoner

### addDecoratorUpdateListener / removeDecoratorUpdateListener

Legger til/fjerner en callback-funksjon som kalles når en ny versjon av dekoratøren er deployet til valgt miljø.

Tiltenkt brukt for cache-invalidering i apper som cacher dekoratørens HTML.

```ts
import { addDecoratorUpdateListener } from "@navikt/nav-dekoratoren-moduler/ssr";

const flushHtmlCache = (versionId: string) => {
    console.log(`New decorator version: ${versionId} - clearing render cache!`);
    myHtmlCache.clear();
};

addDecoratorUpdateListener({ env: "prod" }, flushHtmlCache);
```

### getDecoratorVersionId

Henter nåværende versjons-id for dekoratøren i valgt miljø.

```ts
import { getDecoratorVersionId } from "@navikt/nav-dekoratoren-moduler/ssr";

const currentVersionId = await getDecoratorVersionId({ env: "prod" });
```

### buildCspHeader

Bygger en Content-Security-Policy header som inkluderer dekoratørens påkrevde direktiver, kombinert med applikasjonens egne direktiver. Krever at `csp-header >=5.x` er installert.

Funksjonen gjør et fetch-kall til dekoratøren for å hente gjeldende direktiver.

Eksempel på bruk:

```ts
import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";

// Direktiver appen din benytter
const myAppDirectives = {
    "default-src": ["foo.bar.com"],
    "style-src": ["my.css.cdn.com"],
};

const csp = await buildCspHeader(myAppDirectives, { env: "prod" });

app.get("*", (req, res) => {
    res.setHeader("Content-Security-Policy", csp);

    res.send("Hello!");
});
```

### getAnalyticsInstance

Denne metoden erstatter getAmplitudeInstance, og har tilsvarende interface. Metoden skal støtte det/de til en hver tid gjeldende analyseverktøyet/ene i Nav. Den logger foreløpig til både Umami og Amplitude.
Amplitude fases ut av Nav i november 2025 og Umami er da eneste alternativ. Når avtalen går ut, fjernes loggingen til Amplitude.

Bygger en logger-instans som sender events til våre analyseverktøy via dekoratørens klient. Tar i mot et parameter `origin` slik at man kan filtrere events som kommer fra egen app.
Det er sterkt anbefalt å følge Navs taksonomi for analyseverktøy:
https://github.com/navikt/analytics-taxonomy

Eksempel på bruk:

```ts
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAnalyticsInstance("minAppOrigin");

logger("skjema åpnet", {
    skjemaId: 1234,
    skjemanavn: "aap",
});
```

### getAmplitudeInstance - NB! Vil ikke støttes etter 1.11.2025 NB!

Bygger en logger-instans som sender events til Amplitude via dekoratørens klient. Tar i mot et parameter `origin` slik at man kan filtrere events som kommer fra egen app.
Det er sterkt anbefalt å følge Navs taksonomi for analyseverktøy:
https://github.com/navikt/analytics-taxonomy

Eksempel på bruk:

```ts
import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAmplitudeInstance("minAppOrigin");

logger("skjema åpnet", {
    skjemaId: 1234,
    skjemanavn: "aap",
});
```

Du kan også utvide taxonomien som er definert for å tilpasse ditt bruk. Det har ingen funksjonell effekt, men vil gjøre det lettere for utviklerene i prosjektet å følge en standard hvis ønskelig.

Eksempel på å definere events:

```ts
import { AmplitudeEvent, getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

type SampleCustomEvents =
    | AmplitudeEvent<"first", { hei: string }>
    | AmplitudeEvent<"second", { hei: string }>;

const logger = getAmplitudeInstance<SampleCustomEvents>("minAppOrigin");

logger("first", {
    hei: "hei",
});
```

### setBreadcrumbs

Parameteret `breadcrumbs` (brødsmulestien) kan endres / settes på klient-siden ved behov.

Obs! Klikk på breadcrumbs logges til analyseverktøy (Amplitude+Umami). Ettersom title i noen apper kan inneholde personopplysninger,
som f.eks. navn på bruker, så logges dette i utgangspunktet kun som `[redacted]` til Amplitude+Umami.

Om ønskelig kan feltet `analyticsTitle` også settes, dersom du ønsker å logge en title. Husk å fjerne eventuelle personopplysninger fra denne!

```tsx
// Type
export type DecoratorBreadcrumb = {
    url: string;
    title: string;
    analyticsTitle?: string;
    handleInApp?: boolean;
};

// Bruk
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Kontakt oss",
        url: "https://www.nav.no/person/kontakt-oss/nb/",
        handleInApp: true, // Håndteres av onBreadcrumbClick
    },
]);

// Bruk med analyticsTitle
setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Opplysninger for Ola Nordmann",
        analyticsTitle: "Opplysninger for <Navn>",
        url: "https://www.nav.no/min-innloggede-tjeneste",
    },
]);
```

### onBreadcrumbClick

Kalles med `breadcrumb`-parametre dersom `handleInApp` var satt til `true`. Kan benyttes for client-side routing.

```tsx
import { onBreadcrumbClick } from "@navikt/nav-dekoratoren-moduler";
import router from "my-routing-library";

onBreadcrumbClick((breadcrumb) => {
    router.push(breadcrumb.url);
});
```

### setAvailableLanguages

Parameteret `languages` (liste av tilgjengelige språk i språkvelgeren) kan endres / settes client-side ved behov.
Aktivt språk kan hentes ut fra cookien `decorator-language`.

```tsx
// Type
export type DecoratorLocale = "nb" | "nn" | "en" | "se" | "pl" | "uk" | "ru";
export type DecoratorLanguageOption =
    | {
          url?: string;
          locale: DecoratorLocale;
          handleInApp: true;
      }
    | {
          url: string;
          locale: DecoratorLocale;
          handleInApp?: false;
      };

// Bruk
import { setAvailableLanguages } from "@navikt/nav-dekoratoren-moduler";
setAvailableLanguages([
    { locale: "nb", url: "https://www.nav.no/person/kontakt-oss/nb/" }, // Sender brukeren til definert url
    {
        locale: "en",
        url: "https://www.nav.no/person/kontakt-oss/en/",
        handleInApp: true,
    }, // Håndteres av onLanguageSelect
]);
```

### onLanguageSelect

Kalles med `language`-parametre dersom `handleInApp` var satt til `true`. Kan benyttes for client-side routing.

```tsx
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import router from "my-routing-library";

onLanguageSelect((language) => {
    router.push(language.url);
});
```

### setParams

Samtlige parametre kan settes client-side via `setParams` dersom `setAvailableLanguages` og `setBreadcrumbs` ikke er tilstrekkelig.

```tsx
// Type
export type DecoratorParams = Partial<{
    context: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple: boolean;
    simpleHeader: boolean;
    simpleFooter: boolean;
    redirectToApp: boolean;
    redirectToUrl: string;
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
    pageType: string;
}>;

// Bruk
import { setParams } from "@navikt/nav-dekoratoren-moduler";

setParams({
    simple: true,
    chatbot: true,
});
```

### getParams

Samtlige parametre kan også leses client-side via `getParams`.

```tsx
// Bruk
import { getParams } from "@navikt/nav-dekoratoren-moduler";

getParams();
```

### openChatbot

Hjelpefunksjon for å åpne Chatbot Frida. Denne setter parameteret `chatbotVisible=true` og åpner chat-vinduet.

```tsx
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";

openChatbot();
```

## Plakat for samtykke ("cookie-banner")

Etter at en strengere Lov om elektronisk kommunikasjon (ekomloven) ble gjort gjeldende fra 1. januar 2025, har Nav måttet innhente samtykke før verktøy for analyse, statistikk etc kunne bli tatt i bruk. Du kan lese mer i Dekoratøren om bakgrunn og hvordan prinsippene og det juridiske ved samtykke fungerer.

For nav-dekoratoren-moduler har vi laget en rekke hjelpefunksjoner som et ment å bidra til at teamene etterlever den nye ekomloven.

Disse funksjonene er et forslag til hva vi tror teamene vil kunne trenge, så vi håper at team som ønsker seg andre funksjoner melder ifra på #dekoratøren_på_navno på Slack slik at vi kan utvide nav-dekoratoren-moduler og fortsatt gjøre den nyttig for teamene.

### awaitDecoratorData()

Dersom du trenger å lese/skrive cookies som en del av oppstarten i applikasjonen, kan det hende at du må vente til dekoratøren har lastet inn dataene.

```ts
const initMyApp = async () => {
    await awaitDecoratorData();
    doMyAppStuff();
};
```

### isStorageKeyAllowed(key: string)

Sjekker om en nøkkel er tillatt å sette:

1. er den i tillatt-listen
2. hvis nøkkelen er markert som frivillig (og dermed krever samtykke): har bruker samtykket til denne type lagring

Funksjonene for å lese og skrive (cookies, localstorage etc) sjekker dette selv automatisk, så denne funksjonen er laget for å gi team en mulighet til å sjekke skrivbarhet uten å faktisk skrive.

Kan brukes for både cookies, localStorage og sessionStorage.

```ts
import { isStorageKeyAllowed } from '@navikt/nav-dekoratoren-moduler'

// Returnerer false fordi 'jabberwocky' ikke er i tillatt-listen.
const isJabberwocky = isStorageKeyAllowed('jabberwocky'):

// Selv om 'usertest' er i tillatt-listen har ikke bruker gitt sitt samtykke i dette tenkte eksempelet, så funksjonen returnerer false.
const isUsertestAllowed = isStorageKeyAllowed('usertest-229843829')

```

### getAllowedStorage()

Denne returnerer en liste over alle ting som er lov å sette, enten cookies, localStorage etc. Vi tilbyr denne til team som vil lage sine egne løsninger eller som trenger funksjonalitet som ikke finnes i nav-dekoratoren-moduler. I hovedsak tenker vi at isStorageKeyAllowed ovenfor vil fungere best i de fleste tilfeller.

Retunerer tillatt lagring for både cookies, localStorage og sessionStorage.

### setNavCookie / getNavCookie

Denne kan brukes for å sette cookies og være sikker på at det er tillatt å sette de. Funksjonen sjekker på om (1) cookien er i tillatt-listen og (2) brukeren har gitt nødvendige samtykker hvis cookien er frivillig.

Dersom det for eksempel er en cookie som er team har definert som nødvendig kan den settes uansett så lenge den ligger i listen over tillatte cookies.

Dersom cookien er regnet som frivillig vil den ikke kunne settes dersom bruker ikke har gitt samtykke til at Nav kan lagre alle frivillige cookies.

```ts
import { setNavCookie, getNavCookie } from "@navikt/nav-dekoratoren-moduler";

// Tillatt fordi tillatt-listen har registrert 'usertest-*' som tillatt cookie.
setNavCookie("usertest-382738");

// Returnerer null fordi 'foobar' ikke er i tillatt-listen.
const foo = getNavCookie("foobar");
```

### navSessionStorage og navLocalStorage

Utvider sessionStorage og localStorage og eksponerer de samme funksjonene. Forskjellen er at nav\*Storage først sjekker om en nøkkel er tillatt å sette basert på tillattlisten og status på eksisterende samtykke.
