import { msgSafetyCheck } from './utils'
import { setParams } from './params'

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
        callback(payload)
      }
    }
  }

  window.addEventListener('message', receiveMessage)

  return (_callback: (breadcrumb: Breadcrumb) => void) => {
    callback = _callback
  }
})()

export const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) =>
  setParams({ breadcrumbs })
