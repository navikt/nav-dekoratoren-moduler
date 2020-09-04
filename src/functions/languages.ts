export interface Language {
  locale: string
  url: string
}

export const setAvailableLanguages = (languages: Language[]) => {
  if (window) {
    window.postMessage(
      { source: 'decorator', event: 'availableLanguages', payload: languages },
      window.location.origin
    )
  }
}
