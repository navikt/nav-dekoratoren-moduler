import { isReady, msgSafetyCheck } from './utils'
import { useEffect } from 'react'

export interface Language {
  url: string
  locale: string
  handleInApp?: boolean
}

export const onLanguageSelect = (callback: (language: Language) => void) => {
  useEffect(() => {
    const receiveMessage = (msg: MessageEvent) => {
      const { data } = msg
      const isSafe = msgSafetyCheck(msg)
      const { source, event, payload } = data
      if (isSafe) {
        if (source === 'decorator' && event === 'languageSelect') {
          callback(payload)
        }
      }
    }
    window.addEventListener('message', receiveMessage)
    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [])
}

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
