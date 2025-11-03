# Nav Dekoratøren Moduler

NPM-pakke med hjelpefunksjoner for [Nav Dekoratøren](https://github.com/navikt/nav-dekoratoren) (header og footer på nav.no).

---

## Innholdsfortegnelse 📚

1. [Om pakken 🧠](#1-om-pakken-)
2. [Installasjon og oppsett ⚙️](#2-installasjon-og-oppsett-)
    - [2.1 Ved lokal kjøring](#21-ved-lokal-kjøring)
    - [2.2 Ved bygg på GitHub Actions](#22-ved-bygg-på-github-actions)
3. [Hente dekoratøren 🏗️](#3-hente-dekoratøren-)
    - [3.1 Typer og miljøer](#31-typer-og-miljøer)
    - [3.2 Service Discovery](#32-service-discovery)
    - [3.3 Access Policy](#33-access-policy)
4. [Server-Side Rendering (anbefalt) 🧱](#4-server-side-rendering-anbefalt-)
    - [4.1 Oversikt over SSR-funksjoner](#41-oversikt-over-ssr-funksjoner)
    - [4.2 Detaljer](#42-detaljer)
5. [Client-Side Rendering (CSR) 💻](#5-client-side-rendering-csr-)
    - [5.1 injectDecoratorClientSide](#51-injectdecoratorclientside)
    - [5.2 Bruk med egendefinert dekoratør-url 🔗](#-52-bruk-med-egendefinert-dekoratør-url)
6. [Andre hjelpefunksjoner 🧰](#6-andre-hjelpefunksjoner-)
    - [6.1 Oversikt over hjelpefunksjoner](#61-oversikt-over-hjelpefunksjoner)
    - [6.2 Detaljer](#62-detaljer)
7. [Samtykke og cookies ("cookie-banner") 🍪](#7-samtykke-og-cookies-cookie-banner-)
    - [7.1 awaitDecoratorData](#71-awaitdecoratordata)
    - [7.2 isStorageKeyAllowed](#72-isstoragekeyallowedkey-string)
    - [7.3 getAllowedStorage](#73-getallowedstorage)
    - [7.4 setNavCookie / getNavCookie](#74-setnavcookie--getnavcookie)
    - [7.5 navSessionStorage og navLocalStorage](#75-navsessionstorage-og-navlocalstorage)

---

## 1 Om pakken 🧠

`@navikt/nav-dekoratoren-moduler` gir utviklere et enkelt grensesnitt for å integrere NAVs
dekoratør (header og footer) i egne applikasjoner – både ved **server-side rendering (SSR)** og *
*client-side rendering (CSR)**.

Pakken håndterer miljøkonfigurasjon, service discovery, analyse, språk, brødsmulesti, samtykke (
ekomloven), og mer.

---

## 2 Installasjon og oppsett ⚙️

```bash
npm install --save @navikt/nav-dekoratoren-moduler
```

> 💡 Oppdaterte versjoner publiseres kun i **GitHub Packages Registry**.  
> For å installere nye versjoner må `@navikt`-scopede pakker hentes fra
`https://npm.pkg.github.com`.

### 2.1 Ved lokal kjøring

Legg dette i `.npmrc`-filen (opprett om den ikke finnes):

```
@navikt:registry=https://npm.pkg.github.com
```

Opprett et **Personal Access Token (PAT)** med `read:packages`-scope og SSO auth, og bruk dette som
passord ved login.

```
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

### 2.2 Ved bygg på GitHub Actions

Sett registry-url med f.eks `actions/setup-node` og bruk `NODE_AUTH_TOKEN` fra
`secrets.READER_TOKEN`.

```yaml
- name: Setup node.js
  uses: actions/setup-node@v4
  with:
    registry-url: 'https://npm.pkg.github.com'

- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.READER_TOKEN }}
```

---

## 3 Hente dekoratøren 🏗️

Pakken inneholder funksjoner for å laste inn dekoratøren i apper på ulike måter.

### 3.1 Typer og miljøer

Dekoratøren kan hentes fra ulike miljøer: `prod`, `dev`, `beta`, `betaTms`, eller `localhost`.  
For lokale miljøer må du angi `localUrl`.

```tsx
type DecoratorNaisEnv =
    | "prod" // For produksjons-instans av dekoratøren
    | "dev" // For stabil dev-instans
    | "beta" // Beta dev-instanser er ment for internt test-bruk
    | "betaTms"; // Disse kan være ustabile i lengre perioder

type DecoratorEnvProps =
// Dersom env er satt til localhost, må du selv sette url for dekoratøren.
    | { env: "localhost"; localUrl: string }
    // For nais-miljøer settes url automatisk
    | { env: DecoratorNaisEnv; serviceDiscovery?: boolean };

type DecoratorFetchProps = {
    // Query-parametre til dekoratøren, se dekoratørens readme for dokumentasjon
    params?: DecoratorParams;
} & DecoratorEnvProps;
```

### 3.2 Service Discovery

Server-side fetch bruker [service discovery](https://docs.nais.io/clusters/service-discovery) som
standard. Vær obs på at dette kun fungerer ved kjøring på dev-gcp eller prod-gcp nais-clusterne.
Dersom appen ikke kjører i ett av disse clusterne, vil vi falle tilbake til å kalle eksterne
ingresser.

Du kan også sette parameteret `serviceDiscovery: false` for å alltid benytte eksterne ingresser.

```ts
fetchDecoratorHtml({
    env: "prod",
    serviceDiscovery: false,
});
```

### 3.3 Access Policy

Se [Nais dokumentasjon](https://docs.nais.io/nais-application/access-policy) for oppsett av access
policy.

#### 3.3.1 Ved Service Discovery (default)

Ved bruk av service discovery må følgende regel inkluderes i access policy:

```yaml
accessPolicy:
  outbound:
    rules:
      - application: nav-dekoratoren
        namespace: personbruker
```

#### 3.3.2 Ved eksterne ingresser

Dersom service discovery ikke benyttes, vil dekoratørens eksterne ingresser kalles. Dette gjelder
ved bruk av versjon 1.9 eller tidligere, eller dersom `serviceDiscovery: false` er satt.

Følgende access policy kreves:

```yaml
accessPolicy:
  outbound:
    external:
      - host: www.nav.no # for prod
      - host: dekoratoren.ekstern.dev.nav.no # for dev
```

---

## 4 Server-Side Rendering (anbefalt) 🧱

Server-side rendering (SSR) av dekoratøren anbefales for optimal brukeropplevelse.  
Dersom kallet feiler (etter tre forsøk), falles det tilbake til statiske placeholder-elementer som
rendres client-side.

### 4.1 Oversikt over SSR-funksjoner

| Funksjon                          | Type                | Formål / Forklaring                                                       |
|-----------------------------------|---------------------|---------------------------------------------------------------------------|
| injectDecoratorServerSide         | server-side         | Parser HTML-fil og setter inn dekoratør-HTML via JSDOM                    |
| injectDecoratorServerSideDocument | server-side         | Setter inn dekoratøren i et eksisterende `Document`-objekt                |
| fetchDecoratorHtml                | server-side         | Henter dekoratøren som HTML-fragmenter                                    |
| fetchDecoratorReact               | server-side (React) | Henter dekoratøren som React-komponenter for SSR-rammeverk (Next.js m.m.) |

---

### 4.2 Detaljer

<details>
<summary><strong>Klikk for å utvide detaljene</strong></summary>

#### injectDecoratorServerSide

Parser en HTML-fil med JSDOM og returnerer en HTML-string som inkluderer dekoratøren. Krever at
`jsdom >=16.x` er installert.

```tsx
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSide({
    env: "prod",
    filePath: "index.html",
    params: { context: "privatperson", simple: true },
}).then((htmlWithDecorator: string) => {
    res.send(htmlWithDecorator);
});
```

#### injectDecoratorServerSideDocument

Setter inn dekoratøren i et Document DOM-objekt. Objektet i document-parameteret muteres.

```tsx
import { injectDecoratorServerSideDocument } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSideDocument({
    env: "prod",
    document: myDocument,
    params: { context: "privatperson", simple: true },
}).then((document: Document) => {
    const html = document.documentElement.outerHTML;
    res.send(html);
});
```

#### fetchDecoratorHtml

Henter dekoratøren som HTML-fragmenter.

Eksempel:

```tsx
import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";

const fragments = await fetchDecoratorHtml({
    env: "dev",
    params: { context: "privatperson" },
});

const { DECORATOR_HEAD_ASSETS, DECORATOR_HEADER, DECORATOR_FOOTER, DECORATOR_SCRIPTS } = fragments;

// Sett inn fragmenter i app-html'en med f.eks. en template engine
```

#### fetchDecoratorReact

Henter dekoratøren som React-komponenter. Kan benyttes med React rammeverk som støtter server-side
rendering. Krever at `react >=17.x` og `html-react-parser >=5.x` er installert.

Ved behov kan det settes en egendefinert komponent for `<script>`-elementer i `<Decorator.Scripts>`.
Denne vil erstatte standard `<script>`-tags i parseren. Ved bruk av next.js app-router kan
`next/script` benyttes her, se
eksempel [Eksempel 2- Med next.js app router](#eksempel-2--nextjs-app-router).

##### Eksempel 1 – Next.js Page Router

Brukes i `pages/_document.tsx`:

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

class MyDocument extends Document<DocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        const Decorator = await fetchDecoratorReact({
            env: "prod",
            params: { language: "no", context: "arbeidsgiver" },
        });

        return { ...initialProps, Decorator };
    }

    render() {
        const { Decorator } = this.props;

        return (
            <Html lang={"no"}>
                <Head>
                    <Decorator.HeadAssets />
                </Head>
                <body>
                <Decorator.Header />
                <Main />
                <Decorator.Footer />
                <Decorator.Scripts />
                <NextScript />
                </body>
            </Html>
        );
    }
}
```

##### Eksempel 2 – Next.js App Router

Brukes i `app/layout.tsx` med `next/script` loader:

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const Decorator = await fetchDecoratorReact({
        env: "prod",
    });

    return (
        <html lang="no">
        <head>
            <Decorator.HeadAssets />
        </head>
        <body>
        <Decorator.Header />
        {children}
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
        </body>
        </html>
    );
};

export default RootLayout;
```

</details>


---

## 5 Client-Side Rendering (CSR) 💻

> ⚠️ Merk: CSR gir layout-shift og bør unngås om mulig. Bruk SSR for best opplevelse.

### 5.1 injectDecoratorClientSide

Setter inn dekoratøren i DOM'en client-side. Service discovery kan ikke benyttes ved client-side
injection.

Eksempel:

```tsx
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";

injectDecoratorClientSide({
    env: "prod",
    params: {
        simple: true,
        chatbot: true,
    },
});
```

---

### 🔗 5.2 Bruk med egendefinert dekoratør-url

Dersom `env` er satt til `localhost` må dekoratørens URL settes med parametret `localUrl`. Benyttes
dersom du f.eks. kjører dekoratøren lokalt på egen maskin, eller den hentes via en proxy.

Eksempel:

```tsx
injectDecoratorServerSide({
    filePath: "index.html",
    env: "localhost",
    localUrl: "http://localhost:8089/dekoratoren",
});
```

---

## 6 Andre hjelpefunksjoner 🧰

### 6.1 Oversikt over hjelpefunksjoner

| Funksjon                      | Type                    | Formål / Forklaring                                                        |
|-------------------------------|-------------------------|----------------------------------------------------------------------------|
| addDecoratorUpdateListener    | server-side             | Legger til callback for ny dekoratørversjon, brukes for cache-invalidering |
| removeDecoratorUpdateListener | server-side             | Fjerner registrert callback fra dekoratøren                                |
| getDecoratorVersionId         | server-side             | Henter nåværende versjons-ID for dekoratøren                               |
| buildCspHeader                | server-side             | Bygger Content Security Policy som inkluderer dekoratørens direktiver      |
| getAnalyticsInstance          | client/server           | Logger events til Umami og Amplitude (erstatter getAmplitudeInstance)      |
| getAmplitudeInstance          | client/server (utfases) | Logger events til Amplitude (utfases november 2025)                        |
| setBreadcrumbs                | client-side             | Setter brødsmulesti (breadcrumbs) i dekoratøren                            |
| onBreadcrumbClick             | client-side             | Håndterer klikk på breadcrumbs ved client-side routing                     |
| setAvailableLanguages         | client-side             | Setter tilgjengelige språk i språkvelgeren                                 |
| onLanguageSelect              | client-side             | Håndterer språkvalg ved client-side routing                                |
| setParams                     | client-side             | Oppdaterer dekoratørens parametre dynamisk                                 |
| getParams                     | client-side             | Leser gjeldende dekoratørparametre                                         |
| openChatbot                   | client-side             | Åpner Chatbot Frida og setter `chatbotVisible=true`                        |

### 6.2 Detaljer

<details>
<summary><strong>Klikk for å utvide detaljene</strong></summary>

#### addDecoratorUpdateListener / removeDecoratorUpdateListener

Legger til/fjerner en callback-funksjon som kalles når en ny versjon av dekoratøren er deployet til
valgt miljø.  
Tiltenkt brukt for cache-invalidering i apper som cacher dekoratørens HTML.

```ts
import { addDecoratorUpdateListener } from "@navikt/nav-dekoratoren-moduler/ssr";

const flushHtmlCache = (versionId: string) => {
    console.log(`New decorator version: ${versionId} - clearing render cache!`);
    myHtmlCache.clear();
};

addDecoratorUpdateListener({ env: "prod" }, flushHtmlCache);
```

#### getDecoratorVersionId

Henter nåværende versjons-id for dekoratøren i valgt miljø.

```ts
import { getDecoratorVersionId } from "@navikt/nav-dekoratoren-moduler/ssr";

const currentVersionId = await getDecoratorVersionId({ env: "prod" });
```

#### buildCspHeader

Bygger en CSP (Content Security Policy) header som inkluderer dekoratørens påkrevde direktiver,
kombinert
med applikasjonens egne direktiver.

Funksjonen gjør et fetch-kall til dekoratøren for å hente gjeldende direktiver.

Eksempel:

```ts
import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";

// Direktiver appen din benytter
const myAppDirectives = {
    "default-src": ["foo.bar.com"],
    "style-src": ["my.css.cdn.com"],
};

const csp = await buildCspHeader(myAppDirectives, { env: "prod" });

app.get("*", (req, res) => {
    res.setHeader("Content-Security-Policy", csp);

    res.send("Hello!");
});
```

#### getAnalyticsInstance

Denne metoden erstatter getAmplitudeInstance, og har tilsvarende interface. Metoden skal støtte
det/de til en hver tid gjeldende analyseverktøyet/ene i Nav. Den logger foreløpig til både Umami og
Amplitude.
Amplitude fases ut av Nav i november 2025 og Umami er da eneste alternativ. Når avtalen går ut,
fjernes loggingen til Amplitude.

Bygger en logger-instans som sender events til våre analyseverktøy via dekoratørens klient. Tar i
mot et parameter `origin` slik at man kan filtrere events som kommer fra egen app.
Det er sterkt anbefalt å følge Navs taksonomi for analyseverktøy:
https://github.com/navikt/analytics-taxonomy

Eksempel:

```ts
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAnalyticsInstance("minAppOrigin");

logger("skjema åpnet", {
    skjemaId: 1234,
    skjemanavn: "aap",
});
```

#### getAmplitudeInstance

> ⚠️ Vil ikke støttes etter 01.11.2025

Bygger en logger-instans som sender events til Amplitude via dekoratørens klient. Tar i mot et
parameter `origin` slik at man kan filtrere events som kommer fra egen app.
Det er sterkt anbefalt å følge Navs taksonomi for analyseverktøy:
https://github.com/navikt/analytics-taxonomy

Eksempel:

```ts
import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAmplitudeInstance("minAppOrigin");

logger("skjema åpnet", {
    skjemaId: 1234,
    skjemanavn: "aap",
});
```

Du kan også utvide taxonomien som er definert for å tilpasse ditt bruk. Det har ingen funksjonell
effekt, men vil gjøre det lettere for utviklerene i prosjektet å følge en standard hvis ønskelig.

Eksempel på å definere events:

```ts
import { AmplitudeEvent, getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

type SampleCustomEvents =
    | AmplitudeEvent<"first", { hei: string }>
    | AmplitudeEvent<"second", { hei: string }>;

const logger = getAmplitudeInstance<SampleCustomEvents>("minAppOrigin");

logger("first", {
    hei: "hei",
});
```

#### setBreadcrumbs

Parameteret `breadcrumbs` (brødsmulestien) kan endres / settes på klient-siden ved behov.

Obs! Klikk på breadcrumbs logges til analyseverktøy (Amplitude+Umami). Ettersom title i noen apper
kan inneholde personopplysninger, som f.eks. navn på bruker, så logges dette i utgangspunktet kun
som `[redacted]` til Amplitude+Umami.

Om ønskelig kan feltet `analyticsTitle` også settes, dersom du ønsker å logge en title. Husk å
fjerne eventuelle personopplysninger fra denne!

```tsx
// Type
export type DecoratorBreadcrumb = {
    url: string;
    title: string;
    analyticsTitle?: string;
    handleInApp?: boolean;
};

// Bruk
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";

setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Kontakt oss",
        url: "https://www.nav.no/person/kontakt-oss/nb/",
        handleInApp: true, // Håndteres av onBreadcrumbClick
    },
]);

// Bruk med analyticsTitle
setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Opplysninger for Ola Nordmann",
        analyticsTitle: "Opplysninger for <Navn>",
        url: "https://www.nav.no/min-innloggede-tjeneste",
    },
]);
```

#### onBreadcrumbClick

Kalles med `breadcrumb`-parametre dersom `handleInApp` var satt til `true`. Kan benyttes for
client-side routing.

```tsx
import { onBreadcrumbClick } from "@navikt/nav-dekoratoren-moduler";
import router from "my-routing-library";

onBreadcrumbClick((breadcrumb) => {
    router.push(breadcrumb.url);
});
```

#### setAvailableLanguages

Parameteret `languages` (liste av tilgjengelige språk i språkvelgeren) kan endres / settes
client-side ved behov.
Aktivt språk kan hentes ut fra cookien `decorator-language`.

```tsx
// Type
export type DecoratorLocale = "nb" | "nn" | "en" | "se" | "pl" | "uk" | "ru";
export type DecoratorLanguageOption =
    | {
    url?: string;
    locale: DecoratorLocale;
    handleInApp: true;
}
    | {
    url: string;
    locale: DecoratorLocale;
    handleInApp?: false;
};

// Bruk
import { setAvailableLanguages } from "@navikt/nav-dekoratoren-moduler";

setAvailableLanguages([
    { locale: "nb", url: "https://www.nav.no/person/kontakt-oss/nb/" }, // Sender brukeren til definert url
    {
        locale: "en",
        url: "https://www.nav.no/person/kontakt-oss/en/",
        handleInApp: true,
    }, // Håndteres av onLanguageSelect
]);
```

#### onLanguageSelect

Kalles med `language`-parametre dersom `handleInApp` var satt til `true`. Kan benyttes for
client-side routing.

```tsx
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import router from "my-routing-library";

onLanguageSelect((language) => {
    router.push(language.url);
});
```

#### setParams

Samtlige parametre kan settes client-side via `setParams` dersom `setAvailableLanguages` og
`setBreadcrumbs` ikke er tilstrekkelig.

```tsx
// Type
export type DecoratorParams = Partial<{
    context: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple: boolean;
    simpleHeader: boolean;
    simpleFooter: boolean;
    redirectToApp: boolean;
    redirectToUrl: string;
    language: DecoratorLocale;
    availableLanguages: DecoratorLanguageOption[];
    breadcrumbs: DecoratorBreadcrumb[];
    utilsBackground: "white" | "gray" | "transparent";
    feedback: boolean;
    chatbot: boolean;
    chatbotVisible: boolean;
    shareScreen: boolean;
    logoutUrl: string;
    logoutWarning: boolean;
    redirectOnUserChange: boolean;
    pageType: string;
}>;

// Bruk
import { setParams } from "@navikt/nav-dekoratoren-moduler";

setParams({
    simple: true,
    chatbot: true,
});
```

#### getParams

Leser gjeldende parametre fra dekoratøren.

```tsx
import { getParams } from "@navikt/nav-dekoratoren-moduler";

getParams();
```

#### openChatbot

Åpner Chatbot Frida og setter `chatbotVisible=true`.

```tsx
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";

openChatbot();
```

</details>

---

## 7 Samtykke og cookies ("cookie-banner") 🍪

Etter at en strengere Lov om elektronisk kommunikasjon (ekomloven) ble gjort gjeldende fra 1. januar
2025, har Nav måttet innhente samtykke før verktøy for analyse, statistikk etc kunne bli tatt i
bruk. Du kan lese mer i [Dekoratøren](https://github.com/navikt/nav-dekoratoren) om bakgrunn og
hvordan prinsippene og det juridiske ved samtykke fungerer.

For nav-dekoratoren-moduler har vi laget en rekke hjelpefunksjoner som et ment å bidra til at
teamene etterlever den nye ekomloven.

Disse funksjonene er et forslag til hva vi tror teamene vil kunne trenge, så vi håper at team som
ønsker seg andre funksjoner melder ifra på #dekoratøren_på_navno på Slack slik at vi kan utvide
nav-dekoratoren-moduler og fortsatt gjøre den nyttig for teamene.

### 7.1 awaitDecoratorData

Dersom du trenger å lese/skrive cookies som en del av oppstarten i applikasjonen, kan det hende at
du må vente til dekoratøren har lastet inn dataene.

```ts
const initMyApp = async () => {
    await awaitDecoratorData();
    doMyAppStuff();
};
```

### 7.2 isStorageKeyAllowed(key: string)

Sjekker om en nøkkel er tillatt å sette:

1. er den i tillatt-listen
2. hvis nøkkelen er markert som frivillig (og dermed krever samtykke): har bruker samtykket til
   denne type lagring

Funksjonene for å lese og skrive (cookies, localstorage etc) sjekker dette selv automatisk, så denne
funksjonen er laget for å gi team en mulighet til å sjekke skrivbarhet uten å faktisk skrive.

Kan brukes for både cookies, localStorage og sessionStorage.

```ts
import { isStorageKeyAllowed } from '@navikt/nav-dekoratoren-moduler'

// Returnerer false fordi 'jabberwocky' ikke er i tillatt-listen.
const isJabberwocky = isStorageKeyAllowed('jabberwocky')
:

// Selv om 'usertest' er i tillatt-listen har ikke bruker gitt sitt samtykke i dette tenkte eksempelet, så funksjonen returnerer false.
const isUsertestAllowed = isStorageKeyAllowed('usertest-229843829')

```

### 7.3 getAllowedStorage()

Denne returnerer en liste over alle ting som er lov å sette, enten cookies, localStorage etc. Vi
tilbyr denne til team som vil lage sine egne løsninger eller som trenger funksjonalitet som ikke
finnes i nav-dekoratoren-moduler. I hovedsak tenker vi at isStorageKeyAllowed ovenfor vil fungere
best i de fleste tilfeller.

Retunerer tillatt lagring for både cookies, localStorage og sessionStorage.

### 7.4 setNavCookie / getNavCookie

Denne kan brukes for å sette cookies og være sikker på at det er tillatt å sette de. Funksjonen
sjekker på om (1) cookien er i tillatt-listen og (2) brukeren har gitt nødvendige samtykker hvis
cookien er frivillig.

Dersom det for eksempel er en cookie som er team har definert som nødvendig kan den settes uansett
så lenge den ligger i listen over tillatte cookies.

Dersom cookien er regnet som frivillig vil den ikke kunne settes dersom bruker ikke har gitt
samtykke til at Nav kan lagre alle frivillige cookies.

```ts
import { setNavCookie, getNavCookie } from "@navikt/nav-dekoratoren-moduler";

// Tillatt fordi tillatt-listen har registrert 'usertest-*' som tillatt cookie.
setNavCookie("usertest-382738");

// Returnerer null fordi 'foobar' ikke er i tillatt-listen.
const foo = getNavCookie("foobar");
```

### 7.5 navSessionStorage og navLocalStorage

Utvider sessionStorage og localStorage og eksponerer de samme funksjonene. Forskjellen er at
nav\*Storage først sjekker om en nøkkel er tillatt å sette basert på tillattlisten og status på
eksisterende samtykke.

---
