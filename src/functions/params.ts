import { isReady } from './utils'
import { Language } from './languages'
import { Breadcrumb } from './breadcrumbs'

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

export const setParams = (params: Params) =>
  isReady()
    .then(() =>
      window.postMessage(
        {
          source: 'decoratorClient',
          event: 'params',
          payload: params
        },
        window.location.origin
      )
    )
    .catch((error) => console.warn(error))
