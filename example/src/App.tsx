import React, { useState } from 'react'
import { EnforceLoginLoader, Auth} from '@navikt/nav-dekoratoren-moduler'
import { setAvailableLanguages, onLanguageSelect } from '@navikt/nav-dekoratoren-moduler'
import { setBreadcrumbs, onBreadcrumbClick } from '@navikt/nav-dekoratoren-moduler'

const App = () => {
  const [activeLanguage, setActiveLanguage] = useState("nb");

  onBreadcrumbClick((breadcrumb) => {
    console.log(breadcrumb)
  })

  onLanguageSelect((language) => {
    console.log(`-----------------------`)
    console.log(`Active language: ${activeLanguage}`)
    console.log(`Selected language: ${language.locale}`)
    setActiveLanguage(language.locale);
  })

  const authCallback = (auth: Auth) => {
    console.log(auth)
    setBreadcrumbs([
        {title : "Ditt nav", url: "https://www.nav.no/person/dittnav", handleInApp:true},
        {title : "Kontakt oss", url: "https://www.nav.no/person/kontakt-oss", handleInApp:true}
      ])
    setAvailableLanguages([
        {locale: "nb", url: "https://www.nav.no/no/person", handleInApp:true},
        {locale: "en", url: "https://www.nav.no/en/person", handleInApp:true}
      ])
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
