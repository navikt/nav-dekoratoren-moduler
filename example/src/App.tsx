import React from 'react'

import { EnforceLoginLoader } from 'nav-dekoratoren-moduler'
import { Auth } from '../../src'
import 'nav-dekoratoren-moduler/dist/index.css'

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
