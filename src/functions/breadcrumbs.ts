import { isReady, msgSafetyCheck } from './utils'

export interface Breadcrumb {
  url: string
  title: string
  handleInApp?: boolean
}

export const onBreadcrumbClick = (
  callback: (breadcrumb: Breadcrumb) => void
) => {
  const receiveMessage = (msg: MessageEvent) => {
    const { data } = msg
    const isSafe = msgSafetyCheck(msg)
    const { source, event, payload } = data
    if (isSafe) {
      if (source === 'decorator' && event === 'breadcrumbClick') {
        callback(payload)
      }
    }
  }
  window.addEventListener('message', receiveMessage)
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
