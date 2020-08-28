# @navikt/nav-dekoratoren-moduler

> Moduler til [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren)

[![NPM](https://img.shields.io/npm/v/@navikt/nav-dekoratoren-moduler.svg)](https://www.npmjs.com/package/@navikt/nav-dekoratoren-moduler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @navikt/av-dekoratoren-moduler
```

## Usage

**< EnforceLoginLoader / >**

Parameteret **enforceLogin** i dekoratøren sender brukeren til loginservice ved for lavt innloggingsnivå.
Ulempen er at applikasjonen din kan laste før fronend-kallet mot innloggingslinje-api er ferdig og dekoratøren sender brukeren til loginservice.

EnforceLoginLoader er en wrapper for applikasjonen som viser en spinner mens kallet pågår. Funksjonen authCallback tigges etter velykket innlogging og benyttes for å hente ut brukerens navn ved behov.
```tsx
import React, { Component } from 'react'
import EnforceLoginLoader from '@navikt/nav-dekoratoren-moduler'

const Example = () => {
    const authCallback = (auth: Auth) => {
      console.log(auth)
    }

    return (
        <EnforceLoginLoader authCallback={authCallback}>
            <div className={"testapp__container"}>
              Test app
            </div>
        </EnforceLoginLoader>
    )
}
```

## License

MIT © [mjansrud](https://github.com/mjansrud)
