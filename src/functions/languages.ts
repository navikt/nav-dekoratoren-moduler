export interface Breadcrumb {
  url: string
  name: string
}

export const setAvailableLanguages = (languages: Breadcrumb[]) => {
  if (window) {
    window.postMessage(
      { source: 'decorator', event: 'availableLanguages', payload: languages },
      window.location.origin
    )
  }
}
