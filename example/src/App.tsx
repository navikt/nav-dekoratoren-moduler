import React from 'react'

import { EnforceLoginLoader } from '@navikt/nav-dekoratoren-moduler'
import { Auth } from '../../src'

const App = () => {

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

export default App
