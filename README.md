# nav-dekoratoren-moduler

> Moduler til nav-dekoratoren

[![NPM](https://img.shields.io/npm/v/@navikt/nav-dekoratoren-moduler.svg)](https://www.npmjs.com/package/@navikt/nav-dekoratoren-moduler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @navikt/av-dekoratoren-moduler
```

## Usage

```tsx
import React, { Component } from 'react'

import MyComponent from '@navikt/nav-dekoratoren-moduler'
import '@navikt/nav-dekoratoren-moduler/dist/index.css'

class Example extends Component {
  render() {
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
}
```

## License

MIT © [mjansrud](https://github.com/mjansrud)
