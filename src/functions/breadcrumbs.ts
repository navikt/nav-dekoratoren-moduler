import { isReady, msgSafetyCheck } from './utils'

export interface Breadcrumb {
  url: string
  title: string
  handleInApp?: boolean
}

export const onBreadcrumbClick = (() => {
  let callback: (breadcrumb: Breadcrumb) => void

  const receiveMessage = (msg: MessageEvent) => {
    const { data } = msg
    const isSafe = msgSafetyCheck(msg)
    const { source, event, payload } = data
    if (isSafe) {
      if (callback && source === 'decorator' && event === 'breadcrumbClick') {
        console.log('executing callback for breadcrumbClick')
        callback(payload)
      }
    }
  }

  console.log('adding event listener for breadcrumbClick')
  window.addEventListener('message', receiveMessage)

  return (_callback: (breadcrumb: Breadcrumb) => void) => {
    callback = _callback
  }
})()

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
