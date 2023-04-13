# nav-dekoratoren-moduler

> NPM-pakke med hjelpefunksjoner for [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren) (header og footer på nav.no)

### Nytt i versjon 2.0

#### Breaking changes
- Node.js v18 eller nyere er påkrevd, ettersom vi ikke lengre benytter node-fetch
- Server-side fetch-funksjoner benytter nå [service discovery](https://docs.nais.io/clusters/service-discovery) som default.
- Parametre til fetch-funksjoner er endret, slik at query-parametre til dekoratøren nå er et separat objekt.<br/>
Eksempel 1.x -> 2.0: `{ env: "prod", context: "arbeidsgiver", simple: true}` -> `{ env: "prod", params: { context: "arbeidsgiver", simple: true }}`)
- Ved bruk av `env: "localhost"` må dekoratørens url nå alltid settes med parameteret `localUrl`. Dette erstatter parameterene `port` og `dekoratorenUrl`, og vi har ikke lengre en default localhost url.
- Flere typer er endret eller har fått mer spesifikke navn (f.eks. `Params` -> `DecoratorParams`)

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

Pakka inneholder funksjoner for å laste inn dekoratøren i appen din på ulike måter.

Samtlige funksjoner for fetch av dekoratøren tar inn parametre med følgende type:
```tsx
type DecoratorNaisEnv = 
  | "prod"     // For produksjons-instans av dekoratøren
  | "dev"      // For stabil dev-instans
  | "beta"     // Beta dev-instanser ment for internt test-bruk
  | "betaTms"; // Disse kan være ustabile i lengre perioder

type DecoratorEnvProps =
    // Dersom env er satt til localhost, kan du selv sette url for dekoratøren.
    // Benyttes dersom du f.eks. kjører dekoratøren lokalt på egen maskin, eller den nåes via en proxy
    | { env: "localhost"; localUrl: string; }
    | { env: DecoratorNaisEnv; serviceDiscovery?: boolean; };

type DecoratorFetchProps = {
  // Query-parametre til dekoratøren, se dekoratørens readme for dokumentasjon
  params?: DecoratorParams;
} & DecoratorEnvProps;
```

### Service discovery
Server-side fetch-funksjonene benytter [service discovery](https://docs.nais.io/clusters/service-discovery) som default fra versjon 2.0.
Vær obs på at dette kun fungerer ved kjøring på dev-gcp eller prod-gcp nais-clusterne. Dersom appen ikke kjører i ett av disse clusterne, vil vi falle tilbake til å kalle eksterne ingresser. 

Du kan også sette parameteret `serviceDiscovery: false` for å alltid benytte eksterne ingresser. 

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
Dersom service discovery ikke benyttes, vil dekoratørens eksterne ingresser kalles. Følgende access policy kreves:
```yaml
accessPolicy:
  outbound:
    external:
      - host: www.nav.no                      # for prod
      - host: dekoratoren.ekstern.dev.nav.no  # for dev
```

## Server side rendering (anbefalt)
Server-side rendering av dekoratøren anbefales for optimal brukeropplevelse. Dersom kallet feiler, faller vi tilbake til client-side rendret dekoratør etter 3 retries.

### injectDecoratorServerSide / injectDecoratorServerSideDom

Sett inn dekoratøren i en HTML-fil eller et JSDOM-objekt.

Eksempler på bruk:
```tsx
// Bruk med HTML-fil, uten service discovery
import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'

injectDecoratorServerSide({ env: "prod", filePath: "index.html", params: { context: "privatperson", simple: true } })
  .then((html) => {
    res.send(html);
  })

// Bruk med JSDOM-objekt, med service discovery
import { injectDecoratorServerSideDom } from '@navikt/nav-dekoratoren-moduler/ssr'

injectDecoratorServerSideDom({ env: "prod", serviceDiscovery: true, dom: myJsDomObject, params: { context: "arbeidsgiver" } })
  .then((html) => {
    res.send(html);
  })
```


### fetchDecoratorReact

Henter dekoratøren som React-komponenter.

Eksempel på bruk:
```tsx
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'

const Decorator = await fetchDecoratorReact({
    env: "prod",
    serviceDiscovery: true,
    params: {
      language: 'en',      
    }
});

return (
    <Head>
        <Decorator.Styles />
        <Decorator.Scripts />
    </Head>
    <body>
        <Decorator.Header />
        <MyAppGoesHere />
        <Decorator.Footer />
    </body>
)
```

### fetchDecoratorHtml

Henter dekoratøren som HTML-elementer.

```tsx
import { fetchDecoratorHtml } from '@navikt/nav-dekoratoren-moduler/ssr'

const fragments = await fetchDecoratorHtml({ env: "dev", params: { context: "privatperson" } })

const {
  DECORATOR_STYLES,
  DECORATOR_SCRIPTS,
  DECORATOR_HEADER,
  DECORATOR_FOOTER
} = fragments;

// Fragmenter settes inn i app HTML'en via en template engine el.

```

## Client-side rendering

CSR vil gi en redusert brukeropplevelse pga layout-shifting/"flicker", og bør unngås om mulig.

### injectDecoratorClientSide

Setter inn dekoratøren i DOM'en client-side. Service discovery kan ikke benyttes ved client-side injection.

```tsx
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";

injectDecoratorClientSide({
    env: "prod",
    params: {
      simple: true,
      chatbot: true,
    }
});
```


## Bruk med egendefinert dekoratør-url.

Dersom `env` er satt til `localhost` må dekoratørens URL settes med parametret `localUrl`. Benyttes dersom du f.eks. kjører dekoratøren lokalt på egen maskin, eller den hentes via en proxy.

Eksempel:
```tsx
injectDecoratorServerSide({
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

```tsx
import { logAmplitudeEvent } from "@navikt/nav-dekoratoren-moduler";

const myAmplitudeLogger = (event: string, data: Record<string, any>) => {
    logAmplitudeEvent({
        origin: "my-app", // Navn på kallende applikasjon. Sendes i data-feltet "origin" til Amplitude (påkrevd)
        eventName: event, // Event-navn (påkrevd)
        eventData: data, // Event-data objekt (valgfri)
    }).catch((e) => console.log(`Oh no! ${e}`)); // Funksjonen rejecter ved feil, men kaster ikke exceptions.
};
```

### < EnforceLoginLoader / >

Parameteret **enforceLogin** i dekoratøren sender brukeren til loginservice ved for lavt innloggingsnivå.
Ulempen er at applikasjonen din kan laste før fronend-kallet mot innloggingslinje-api er ferdig og dekoratøren sender brukeren til loginservice.

EnforceLoginLoader er en wrapper for applikasjonen som viser en spinner mens sjekken pågår. Funksjonen authCallback trigges etter vellykket innlogging og benyttes for å hente ut brukerens navn ved behov.

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

Parameteret **breadcrumbs** (brødsmulestien) kan endres / settes i frondend-apper ved behov.

Obs! Klikk på breadcrumbs logges til analyseverktøy (Amplitude). Dersom title kan inneholde sensitive opplysninger<br/>
som f.eks. navn på bruker, må feltet analyticsTitle også settes. Dette feltet vil da logges istedenfor title.

```tsx
// Type
export interface Breadcrumb {
    url: string;
    title: string;
    analyticsTitle?: string;
    handleInApp?: boolean;
}

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

Kalles dersom handleInApp settes til **true**

```tsx
import { onBreadcrumbClick } from '@navikt/nav-dekoratoren-moduler'
onBreadcrumbClick((breadcrumb) => {
  ...
})
```

### setAvailableLanguages

Parameteret **languages** (liste av tilgjengelige språk i språkvelgeren) kan endres / settes i frondend-apper ved behov. <br>
Hent aktivt språk ved hjelp av url eller cookien **decorator-language**.

```tsx
// Type
export interface Language {
    url: string;
    locale: string;
    handleInApp?: boolean;
}

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

Kalles dersom handleInApp settes til **true**

```tsx
import { onLanguageSelect } from '@navikt/nav-dekoratoren-moduler'
onLanguageSelect((language) => {
  ...
})
```

### setParams

Samtlige parameter kan settes via **setParams** dersom **setAvailableLanguages** og **setBreadcrumbs** ikke er tilstrekkelig

```tsx
// Type
export interface Params {
    context?: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple?: boolean;
    enforceLogin?: boolean;
    redirectToApp?: boolean;
    redirectToUrl?: string;
    level?: string;
    language?: "nb" | "nn" | "en" | "se" | "pl" | "uk" | "ru";
    availableLanguages?: Language[];
    breadcrumbs?: Breadcrumb[];
    utilsBackground?: "white" | "gray" | "transparent";
    feedback?: boolean;
    chatbot?: boolean;
    chatbotVisible?: boolean;
    urlLookupTable?: boolean;
    shareScreen?: boolean;
    logoutUrl?: string;
}

// Bruk
import { setParams } from "@navikt/nav-dekoratoren-moduler";
setParams({
    simple: true,
    chatbot: true,
});
```

### openChatbot

Hjelpefunksjon for å åpne Chatbot Frida. Denne setter parameteret `chatbotVisible=true` og åpner chat-vinduet.
