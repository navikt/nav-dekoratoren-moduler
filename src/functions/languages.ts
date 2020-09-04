export interface Breadcrumb {
  url: string
  name: string
}

export const setLanguages = (languages: Breadcrumb[]) => {
  if (window) {
    window.postMessage(
      { source: 'decorator', event: 'languages', payload: languages },
      window.location.origin
    )
  }
}
