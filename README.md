# Moduler til nav-dekoratoren

> Moduler til [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren)

## Install
```
npm install --save @navikt/nav-dekoratoren-moduler
```

Obs! Pakkene publiseres nå kun i GitHub Packages registry'et. For å kunne installere nyere versjoner må pakker fra @navikt-orgen scopes til GitHub Packages.

#### Ved lokal kjøring:
- Legg til dette i `.npmrc`-fila for prosjektet. Opprett fila på rot i prosjektet hvis den ikke finnes.
```
@navikt:registry=https://npm.pkg.github.com
```
- Opprett et PAT med `read:packages` scope, og bruk dette som passord ved login.
```
npm login --registry https://npm.pkg.github.com
```

#### Ved bygg på Github Actions:
- Sett registry url med f.eks. `actions/setup-node`:
```
- name: Setup node.js
  uses: actions/setup-node@v3
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


## Bruk

### buildCspHeader

Bygger en Content-Security-Policy header som inkluderer dekoratørens påkrevde direktiver, kombinert med applikasjonens egne direktiver.<br>

Funksjonen gjør et fetch-kall til dekoratøren for å hente gjeldende direktiver.<br>  

Eksempel på bruk:
```tsx
import { buildCspHeader } from '@navikt/nav-dekoratoren-moduler/ssr';

// Direktiver appen din benytter
const myAppDirectives = {
    'default-src': ['foo.bar.com'],
    'style-src': ['my.css.cdn.com']
}

const csp = await buildCspHeader(myAppDirectives, {env: 'prod'})

app.get('*', (req, res) => {
    res.setHeader('Content-Security-Policy', csp);
    
    res.send('Hello!')
})

```

### logAmplitudeEvent

Sender events til Amplitude via dekoratørens klient.

Eksempel på bruk:
```tsx
import { logAmplitudeEvent } from "@navikt/nav-dekoratoren-moduler";

const myAmplitudeLogger = (event: string, data: Record<string, any>) => {
    logAmplitudeEvent({
        origin: "my-app",       // Navn på kallende applikasjon, tjeneste, etc. Sendes i data-feltet "origin" til Amplitude (påkrevd)
        eventName: event,       // Event-navn (påkrevd)
        eventData: data         // Event-data objekt (valgfri)
    })
        .catch(e => console.log(`Oh no! ${e}`)) // Valgfri feilhåndtering. Funksjonen rejecter ved feil, men kaster ikke exceptions.
}
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

### injectDecoratorServerSide(Dom)

Sett inn dekoratøren i en HTML-fil eller JSDOM-objekt server-side.

```sh
npm install @navikt/nav-dekoratoren-moduler node-cache node-fetch jsdom
```

```tsx
// Type
export type Props = Params & (
  | { env: "prod" | "dev" | "q0" | "q1" | "q2" | "q6"; }
  | { env: "localhost"; port: number; }
  );

// Bruk med HTML-fil
import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'

injectDecoratorServerSide({ env: "prod", filePath: "index.html", simple: true, chatbot: true })
  .then((html) => {
    res.send(html);
  })
  .catch((e) => {
  ...
  })

// Bruk med JSDOM-objekt
import { injectDecoratorServerSideDom } from '@navikt/nav-dekoratoren-moduler/ssr'

injectDecoratorServerSideDom({ env: "prod", dom: myJsDomObject, simple: true, chatbot: true })
  .then((html) => {
    res.send(html);
  })
  .catch((e) => {
  ...
  })
```

Dersom du

### injectDecoratorClientSide

Sett inn dekoratøren dynamisk client-side.

:warning: CSR (Client-Side-Rendering) av dekoratøren kan påvirke ytelsen.

```sh
npm install @navikt/nav-dekoratoren-moduler
```

```tsx
// Type
export type Props = Params &
    ({ env: "prod" | "dev" } | { env: "localhost"; port: number });

// Bruk
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
injectDecoratorClientSide({
    env: "localhost",
    port: 8100,
    simple: true,
    chatbot: true,
});
```

### fetchDecoratorReact

Hent React-komponentene til dekoratøren server-side.

```sh
npm install @navikt/nav-dekoratoren-moduler node-cache node-fetch html-react-parser jsdom
```

```tsx
// Type
export type Props = Params & (
    | { env: "prod" | "dev"; }
    | { env: "localhost"; port: number; }
);

// Bruk
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
const Decorator = await fetchDecoratorReact({
    env: "prod",
    simple: true,
    chatbot: true
});

return (
    <Head>
        <Decorator.Styles />
        <Decorator.Scripts />
    </Head>
    <body>
        <Decorator.Header />
        ...
        <Decorator.Footer />
    </body>
)
```

### fetchDecoratorHtml

Hent elementene til dekoratøren server-side.

```sh
npm install @navikt/nav-dekoratoren-moduler node-cache node-fetch jsdom
```

```tsx
// Type
export type Props = Params & (
    | { env: "prod" | "dev"; }
    | { env: "localhost"; port: number; }
);

// Bruk
import { fetchDecoratorHtml } from '@navikt/nav-dekoratoren-moduler/ssr'
fetchDecoratorHtml({ env: "dev", simple: true, chatbot: true })
    // Cached innerHTML of { DECORATOR_HEADER, DECORATOR_FOOTER, DECORATOR_SCRIPTS, DECORATOR_STYLES }
    .then((fragments) => {
        res.render("index.html", fragments);
    })
    .catch((e) => {
        ...
    });
```

### URL override

Gitt at `env === localhost` vil URL til Dekoratøren kunne overstyres med `dekoratorenUrl`, som da erstatter `localhost:${port}/dekoratoren`. Nyttig hvis man trenger å angi URL til Dekoratøren i et Docker Compose-miljø hvor dekoratøren inkluderes fra en back-end service.

```tsx
injectDecoratorServerSide({
    env: "localhost",
    dekoratorenUrl: "http://dekoratoren:8088/dekoratoren",
});
```
