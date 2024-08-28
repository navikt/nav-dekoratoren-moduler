### Versjon 2.0
-   Node.js v18 eller nyere er påkrevd, ettersom vi ikke lengre benytter node-fetch. (Node 18 har fetch innebygd)
-   Server-side fetch-funksjoner benytter nå [service discovery](#service-discovery) som default. Dette krever visse [access policy](#access-policy) regler.
-   Parametre til fetch-funksjoner er endret, slik at query-parametre til dekoratøren nå er et separat objekt.<br/>
    Eksempel 1.x -> 2.0: `{ env: "prod", context: "arbeidsgiver", simple: true}` -> `{ env: "prod", params: { context: "arbeidsgiver", simple: true }}`)
-   Ved bruk av `env: "localhost"` må dekoratørens url nå alltid settes med parameteret `localUrl`. Dette erstatter parameterene `port` og `dekoratorenUrl`, og vi har ikke lengre en default localhost url.
-   Flere typer er endret eller har fått mer spesifikke navn (f.eks. `Params` -> `DecoratorParams`)