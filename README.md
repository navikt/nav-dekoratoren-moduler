# Moduler til nav-dekoratoren

> Moduler til [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren)

[![NPM](https://img.shields.io/npm/v/@navikt/nav-dekoratoren-moduler.svg)](https://www.npmjs.com/package/@navikt/nav-dekoratoren-moduler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @navikt/nav-dekoratoren-moduler
```

## Usage

### < EnforceLoginLoader / >

Parameteret **enforceLogin** i dekoratøren sender brukeren til loginservice ved for lavt innloggingsnivå.
Ulempen er at applikasjonen din kan laste før fronend-kallet mot innloggingslinje-api er ferdig og dekoratøren sender brukeren til loginservice.

EnforceLoginLoader er en wrapper for applikasjonen som viser en spinner mens sjekken pågår. Funksjonen authCallback tigges etter vellykket innlogging og benyttes for å hente ut brukerens navn ved behov.

```tsx
import React, { Component } from 'react'
import { EnforceLoginLoader } from '@navikt/nav-dekoratoren-moduler'

const Wrapper = () => {
    const authCallback = (auth: Auth) => {
      console.log(auth)
    }

    return (
        <EnforceLoginLoader authCallback={authCallback}>
            <App />
        </EnforceLoginLoader>
    )
}

ReactDOM.render(<Wrapper />, document.getElementById('app'))
```

### setBreadcrumbs

Parameteret **breadcrumbs** (brødsmulestien) kan endres / settes i frondend-apper ved behov.

```tsx
// Type
export interface Breadcrumb {
  url: string
  title: string
  handleInApp?: boolean
}

// Bruk
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler'
setBreadcrumbs([
  {"title":"Ditt NAV", "url":"https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
  {"title":"Kontakt oss", "url":"https://www.nav.no/person/kontakt-oss/nb/", handleInApp: true } // Håndteres av onBreadcrumbClick
])
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
  url: string
  locale: string
  handleInApp?: boolean
}

// Bruk
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler'
setAvailableLanguages([
  {"locale":"nb", "url":"https://www.nav.no/person/kontakt-oss/nb/" }, // Sender brukeren til definert url
  {"locale":"en", "url":"https://www.nav.no/person/kontakt-oss/en/", handleInApp: true },  // Håndteres av onLanguageSelect
])
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
}

// Bruk
import { setParams } from '@navikt/nav-dekoratoren-moduler'
setParams({
  simple: true,
  chatbot: true
})
```

### injectDecoratorServerSide

Sett inn dekoratøren i en HTML-fil server-side.

```sh
npm install @navikt/nav-dekoratoren-moduler node-cache node-fetch jsdom
```

```tsx
// Type
export type Props = Params & (
    | { env: "prod" | "dev" | "q0" | "q1" | "q2" | "q6"; }
    | { env: "localhost"; port: number; }
);

// Bruk
import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'
injectDecoratorServerSide({ env: "prod", filePath: "index.html", simple: true, chatbot: true })
    .then((html) => {
        res.send(html);
    })
    .catch((e) => {
        ...
    })    
```

### injectDecoratorClientSide

Sett inn dekoratøren dynamisk client-side.

:warning:   CSR (Client-Side-Rendering) av dekoratøren kan påvirke ytelsen.

```sh
npm install @navikt/nav-dekoratoren-moduler
```

```tsx
// Type
export type Props = Params & (
    | { env: "prod" | "dev" | "q0" | "q1" | "q2" | "q6"; }
    | { env: "localhost"; port: number; }
);

// Bruk
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler'
injectDecoratorClientSide({
    env: "localhost",
    port: 8100,
    simple: true,
    chatbot: true
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
    | { env: "prod" | "dev" | "q0" | "q1" | "q2" | "q6"; }
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
    | { env: "prod" | "dev" | "q0" | "q1" | "q2" | "q6"; }
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
  env: 'localhost'
  dekoratorenUrl: 'http://dekoratoren:8088/dekoratoren',
})
```

### taSurveys (Task Analytics)

Dette er for team som ønsker å sette opp egne Task Analytics-undersøkelser i applikasjonen sin. Hver undersøkelse har en egen id, feks '01234' og denne id'en oppgis som verdi i taSurveys.

Det er mulig å legge inn flere undersøkelser samtidig, ved å legge inn kommaseparerte id'er. Feks '01234,04733...', men kun én undersøkelse blir vist av gangen.

Dersom teamet ditt ønsker å komme igang med Task Analytics, ta kontakt med #team-personbruker på Slack.
