import { isReady } from './utils'

export interface Language {
  locale: string
  url: string
}

export const setAvailableLanguages = (languages: Language[]) =>
  isReady()
    .then(() =>
      window.postMessage(
        {
          source: 'decorator',
          event: 'availableLanguages',
          payload: languages
        },
        window.location.origin
      )
    )
    .catch((error) => console.warn(error))
