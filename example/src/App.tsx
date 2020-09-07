import React from 'react'

import { EnforceLoginLoader, Auth, setAvailableLanguages, setBreadcrumbs} from '@navikt/nav-dekoratoren-moduler'

const App = () => {

  const authCallback = (auth: Auth) => {
    console.log(auth)

    setBreadcrumbs([{name : "Kontakt oss", url: "https://www.nav.no/person/kontakt-oss"}])
    setAvailableLanguages([{locale: "nb", url: "https://www.nav.no/no/person"}, {locale: "en", url: "https://www.nav.no/en/person"}])
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
