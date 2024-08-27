# nav-dekoratoren-moduler

> NPM-pakke med hjelpefunksjoner for [dekoratøren](https://github.com/navikt/decorator-next) (header og footer på nav.no)

### Breaking changes i versjon 2.0

-   Node.js v18 eller nyere er påkrevd, ettersom vi ikke lengre benytter node-fetch. (Node 18 har fetch innebygd)
-   Server-side fetch-funksjoner benytter nå [service discovery](#service-discovery) som default. Dette krever visse [access policy](#access-policy) regler.
-   Parametre til fetch-funksjoner er endret, slik at query-parametre til dekoratøren nå er et separat objekt.<br/>
    Eksempel 1.x -> 2.0: `{ env: "prod", context: "arbeidsgiver", simple: true}` -> `{ env: "prod", params: { context: "arbeidsgiver", simple: true }}`)
-   Ved bruk av `env: "localhost"` må dekoratørens url nå alltid settes med parameteret `localUrl`. Dette erstatter parameterene `port` og `dekoratorenUrl`, og vi har ikke lengre en default localhost url.
-   Flere typer er endret eller har fått mer spesifikke navn (f.eks. `Params` -> `DecoratorParams`)

## Kom i gang

```
npm install --save @navikt/nav-dekoratoren-moduler
```

Obs! Pakkene publiseres nå kun i GitHub Packages registry'et. For å kunne installere nyere versjoner må pakker fra @navikt-orgen scopes til GitHub Packages.

#### Ved lokal kjøring:

-   Legg til dette i `.npmrc`-fila for prosjektet. Opprett fila på rot i prosjektet hvis den ikke finnes.

```
@navikt:registry=https://npm.pkg.github.com
```

-   Opprett et PAT med `read:packages` scope, og bruk dette som passord ved login.

```
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

#### Ved bygg på Github Actions:

-   Sett registry url med f.eks. `actions/setup-node`:

```
- name: Setup node.js
  uses: actions/setup-node@v3
  with:
    registry-url: 'https://npm.pkg.github.com'
```

-   Sett `NODE_AUTH_TOKEN` på `npm ci`. `READER_TOKEN` er en navikt org-wide secret til dette formålet.

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
    | "prod"        // For produksjons-instans av dekoratøren
    | "dev"         // For stabil dev-instans
    | "beta"        // Beta dev-instanser ment for internt test-bruk
    | "betaTms"     // Disse kan være ustabile i lengre perioder
    
    | "devNext"     // Obs: (dev|prod)Next er avviklet og kan ikke benyttes
    | "prodNext";   //

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

<span id="service-discovery"/>

### Service discovery

Server-side fetch-funksjonene benytter [service discovery](https://docs.nais.io/clusters/service-discovery) som default fra versjon 2.0.
Vær obs på at dette kun fungerer ved kjøring på dev-gcp eller prod-gcp nais-clusterne. Dersom appen ikke kjører i ett av disse clusterne, vil vi falle tilbake til å kalle eksterne ingresser.

Du kan også sette parameteret `serviceDiscovery: false` for å alltid benytte eksterne ingresser.

```tsx
fetchDecoratorHtml({
    env: "prod",
    serviceDiscovery: false,
});
```

<span id="access-policy"/>

### Access policy

Se [nais doc](https://docs.nais.io/nais-application/access-policy) for oppsett av access policy.

#### Service discovery (default fra versjon 2.0)

Ved bruk av service discovery må følgende regel inkluderes i access policy:

```yaml
accessPolicy:
    outbound:
        rules:
            - application: nav-dekoratoren
              namespace: personbruker
```

#### Eksterne ingresser (1.9 eller tidligere)

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

### injectDecoratorServerSide / injectDecoratorServerSideDom

Setter inn dekoratøren i en HTML-fil eller et JSDOM-objekt, og returnerer en HTML-string.

Bruk med HTML-fil:

```tsx
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSide({
    env: "prod",
    filePath: "index.html",
    params: { context: "privatperson", simple: true },
}).then((html) => {
    res.send(html);
});
```

Bruk med JSDOM-objekt:

```tsx
import { injectDecoratorServerSideDom } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSideDom({
    env: "prod",
    dom: myJsDomObject,
    params: { context: "privatperson", simple: true },
}).then((html) => {
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

const {
    DECORATOR_STYLES,
    DECORATOR_SCRIPTS,
    DECORATOR_HEADER,
    DECORATOR_FOOTER,
} = fragments;

// Sett inn fragmenter i app-html'en med f.eks. en template engine
```

### fetchDecoratorReact

Henter dekoratøren som React-komponenter. Kan benyttes med React rammeverk som støtter server-side rendering.

Eksempel på bruk med next.js (settes inn i en custom \_document page):

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
                    <Decorator.Styles />
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

## Client-side rendering

CSR vil gi en redusert brukeropplevelse pga layout-shifting/"pop-in" når headeren rendres, og bør unngås om mulig.

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
    localUrl: "http://localhost:8088/dekoratoren",
});
```

# Andre hjelpefunksjoner

### buildCspHeader

Bygger en Content-Security-Policy header som inkluderer dekoratørens påkrevde direktiver, kombinert med applikasjonens egne direktiver.<br>

Funksjonen gjør et fetch-kall til dekoratøren for å hente gjeldende direktiver.<br>

Eksempel på bruk:

```tsx
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

### logAmplitudeEvent

Sender events til Amplitude via dekoratørens klient.

Eksempel på bruk:

```ts
import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAmplitudeInstance("dekoratoren");

logger("skjema åpnet", {
    skjemaId: 1234,
    skjemanavn: "aap",
});
```

Du kan også utvide taxonomien som er definert for å tilpasse ditt bruk. Det har ingen funksjonell effekt, men vil gjøre det lettere for utviklerene i prosjektet å følge en standard hvis ønskelig.

Eksempel på å definere events:

```ts
import {
    AmplitudeEvent,
    getAmplitudeInstance,
} from "@navikt/nav-dekoratoren-moduler";

type SampleCustomEvents =
    | AmplitudeEvent<"first", { hei: string }>
    | AmplitudeEvent<"second", { hei: string }>;

const logger = getAmplitudeInstance<SampleCustomEvents>("dekoatoren");

logger("first", {
    hei: "hei",
});
```

### < EnforceLoginLoader / >

Parameteret `enforceLogin` i dekoratøren sender brukeren til loginservice ved for lavt innloggingsnivå.
Ulempen er at applikasjonen din kan laste før frontend-kallet mot nav-dekoratoren-api er ferdig og dekoratøren sender brukeren til loginservice.

`EnforceLoginLoader` er en wrapper for applikasjonen som viser en spinner mens sjekken pågår. Funksjonen `authCallback` trigges etter vellykket innlogging og benyttes for å hente ut brukerens navn ved behov.

```tsx
import React, { Component } from "react";
import { EnforceLoginLoader } from "@navikt/nav-dekoratoren-moduler";

const Wrapper = () => {
    const authCallback = (auth: Auth) => {
        console.log(auth);
    };

    return (
        <EnforceLoginLoader authCallback={authCallback}>
            <App />
        </EnforceLoginLoader>
    );
};

ReactDOM.render(<Wrapper />, document.getElementById("app"));
```

### setBreadcrumbs

Parameteret `breadcrumbs` (brødsmulestien) kan endres / settes på klient-siden ved behov.

Obs! Klikk på breadcrumbs logges til analyseverktøy (Amplitude). Ettersom title i noen apper kan inneholde personopplysninger,
som f.eks. navn på bruker, så logges dette i utgangspunktet kun som `[redacted]` til Amplitude.

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
    { title: "Ditt NAV", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Kontakt oss",
        url: "https://www.nav.no/person/kontakt-oss/nb/",
        handleInApp: true, // Håndteres av onBreadcrumbClick
    },
]);

// Bruk med analyticsTitle
setBreadcrumbs([
    { title: "Ditt NAV", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
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
    enforceLogin: boolean;
    redirectToApp: boolean;
    redirectToUrl: string;
    level: string;
    language: DecoratorLocale;
    availableLanguages: DecoratorLanguageOption[];
    breadcrumbs: DecoratorBreadcrumb[];
    utilsBackground: "white" | "gray" | "transparent";
    feedback: boolean;
    chatbot: boolean;
    chatbotVisible: boolean;
    urlLookupTable: boolean;
    shareScreen: boolean;
    logoutUrl: string;
    logoutWarning: boolean;
}>;

// Bruk
import { setParams } from "@navikt/nav-dekoratoren-moduler";

setParams({
    simple: true,
    chatbot: true,
});
```

## Språkstøtte

Grensesnittet (header, meny etc) finnes i tre språkdrakter: norsk bokmål (nb), engelsk (en) og delvis samisk (se).

Du kan angi at språkvelgeren skal støtte flere språk enn dette, som beskrevet i seksjonen ovenfor, men det er kun disse tre språkene som kan vises i selve dekoratør-grensesnittet. For de resterende språkene som språkvelgeren støtter, så vil "nærmeste" relevante språk vises istedet, feks:

-   nn => nb
-   pl => en
-   ru => en

### openChatbot

Hjelpefunksjon for å åpne Chatbot Frida. Denne setter parameteret `chatbotVisible=true` og åpner chat-vinduet.

```tsx
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";

openChatbot();
```
