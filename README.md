# Moduler til nav-dekoratoren

> Moduler til [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren)

[![NPM](https://img.shields.io/npm/v/@navikt/nav-dekoratoren-moduler.svg)](https://www.npmjs.com/package/@navikt/nav-dekoratoren-moduler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @navikt/nav-dekoratoren-moduler
```

## Usage

**< EnforceLoginLoader / >**

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

**setBreadcrumbs**

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

**onBreadcrumbClick**

Kalles dersom handleInApp settes til **true**

```tsx
import { onBreadcrumbClick } from '@navikt/nav-dekoratoren-moduler'
onBreadcrumbClick((breadcrumb) => {
  ...
})
```

**setAvailableLanguages**

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

**onLanguageSelect**

Kalles dersom handleInApp settes til **true**

```tsx
import { onLanguageSelect } from '@navikt/nav-dekoratoren-moduler'
onLanguageSelect((language) => {
  ...
})
```

**setParams**

Samtlige parameter kan settes via **setParams** dersom **setAvailableLanguages** og **setBreadcrumbs** ikke er tilstrekkelig

```tsx
// Type
export interface Params {
  context?: 'privatperson' | 'arbeidsgiver' | 'samarbeidspartner'
  simple?: boolean
  enforceLogin?: boolean
  redirectToApp?: boolean
  level?: string
  language?: 'nb' | 'nn' | 'en' | 'se'
  availableLanguages?: Language[]
  breadcrumbs?: Breadcrumb[]
  feedback?: boolean
  chatbot?: boolean
}

// Bruk
import { setParams } from '@navikt/nav-dekoratoren-moduler'
setParams({
  simple: true,
  chatbot: true
})
```

**SSR.fetchDecoratorHtml**

Hent elementene til dekoratøren server-side

```tsx
// Type
export type ENV = "prod" | "dev" | "q0" | "q1" | "q2" | "q6"

// Bruk
import { SSR } from '@navikt/nav-dekoratoren-moduler'
SSR.fetchDecoratorHtml(env, params)
    // Cached innerHTML of { header, footer, scripts, styles }
    .then((fragments) => {
      res.render("index.html", fragments);
    })
    .catch((e) => {
      ...
    });
```

**SSR.fetchDecoratorReact**

Hent React-komponentene til dekoratøren server-side

```tsx
// Type
export type ENV = "prod" | "dev" | "q0" | "q1" | "q2" | "q6"

// Bruk
import { SSR } from '@navikt/nav-dekoratoren-moduler'
const { Header, Footer, Scripts, Styles } = await SSR.fetchDecoratorReact(env, params);
```

## License

MIT © [mjansrud](https://github.com/mjansrud)
