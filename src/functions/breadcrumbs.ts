import { isReady } from './utils'

export interface Breadcrumb {
  url: string
  name: string
}

export const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) =>
  isReady()
    .then(() =>
      window.postMessage(
        {
          source: 'decoratorClient',
          event: 'breadcrumbs',
          payload: breadcrumbs
        },
        window.location.origin
      )
    )
    .catch((error) => console.warn(error))
