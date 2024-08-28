### Versjon 3.0
- Server-side fetch-funksjoner henter nå ferdige HTML-fragmenter fra `/ssr`-endepunktet, istedenfor å parse hele dekoratørens HTML.
- (breaking) Alle dekoratørens `<head>`-elementer er nå inkludert i det påkrevde fragmentet `DECORATOR_HEAD_ASSETS`. CSS, favicon, etc.
- (breaking) Fjerner `DECORATOR_STYLES`/`Styles` fra responsen for `fetchDecoratorHtml`/`fetchDecoratorReact` (see above!).
- Den innbygde cachen av dekoratørens elementer invalideres nå automatisk når en ny versjon av dekoratøren er tilgjengelig.
- Nye funksjoner: `addDecoratorUpdateListener`, `removeDecoratorUpdateListener`, `getDecoratorVersionId`. Tiltenkt brukt for cache-invalidering i apper som cacher dekoratøren på andre måter.
- Fjerner typer for ubrukte parametre `urlLookupTable`, `enforceLogin` og `level`
- (breaking) Fjerner `<EnforceLoginLoader/>`
- (breaking) Fjerner `injectDecoratorServerSideDom`. Denne erstattes av `injectDecoratorServerSideDocument`, som tar inn et standard Document DOM-objekt.
- (breaking) Fjerner `getUrlFromLookupTable` og tilhørende url-mappinger
- (breaking) Fjerner `parseDecoratorHTMLToReact`
- (breaking) Alle dependencies er nå optional peer dependencies

### Versjon 2.0
-   Node.js v18 eller nyere er påkrevd, ettersom vi ikke lengre benytter node-fetch. (Node 18 har fetch innebygd)
-   Server-side fetch-funksjoner benytter nå [service discovery](#service-discovery) som default. Dette krever visse [access policy](#access-policy) regler.
-   Parametre til fetch-funksjoner er endret, slik at query-parametre til dekoratøren nå er et separat objekt.<br/>
    Eksempel 1.x -> 2.0: `{ env: "prod", context: "arbeidsgiver", simple: true}` -> `{ env: "prod", params: { context: "arbeidsgiver", simple: true }}`)
-   Ved bruk av `env: "localhost"` må dekoratørens url nå alltid settes med parameteret `localUrl`. Dette erstatter parameterene `port` og `dekoratorenUrl`, og vi har ikke lengre en default localhost url.
-   Flere typer er endret eller har fått mer spesifikke navn (f.eks. `Params` -> `DecoratorParams`)