export interface Breadcrumb {
  url: string
  name: string
}

export const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) => {
  if (window) {
    window.postMessage(
      { source: 'decorator', event: 'breadcrumbs', payload: breadcrumbs },
      window.location.origin
    )
  }
}
