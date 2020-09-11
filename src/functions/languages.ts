import { isReady, msgSafetyCheck } from './utils'

export interface Language {
  url: string
  locale: string
  handleInApp?: boolean
}

export const onLanguageSelect = (() => {
  let callback: (language: Language) => void

  const receiveMessage = (msg: MessageEvent) => {
    const { data } = msg
    const isSafe = msgSafetyCheck(msg)
    const { source, event, payload } = data
    if (isSafe) {
      if (source === 'decorator' && event === 'languageSelect' && callback) {
        console.log('executing callback for languageSelect')
        callback(payload)
      }
    }
  }

  console.log('adding event listener for languageSelect')
  window.addEventListener('message', receiveMessage)

  return (_callback: (language: Language) => void) => {
    console.log('updating callback for languageSelect')
    callback = _callback
  }
})()

export const setAvailableLanguages = (languages: Language[]) =>
  isReady()
    .then(() =>
      window.postMessage(
        {
          source: 'decoratorClient',
          event: 'availableLanguages',
          payload: languages
        },
        window.location.origin
      )
    )
    .catch((error) => console.warn(error))
