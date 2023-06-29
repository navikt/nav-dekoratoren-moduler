type MakeExtendable<T> = Partial<T> & Record<string, unknown>;

type AccordianÅpnet = {
    name: 'accordian åpnet';
    properties: MakeExtendable<{
        /**
         * Tekst på accordian som åpnes.
         */
        tekst: string;
    }>;
};

type AccordianLukket = {
    name: 'accordian lukket';
    properties: MakeExtendable<{
        /**
         * Tekst på accordian som lukkes.
         */
        tekst: string;
    }>;
};

type AlertVist = {
    name: 'alert vist',
    properties: MakeExtendable<{
        /**
         * Hvilken variant av alert. F.eks warning
         */
        variant: string,
        /**
         * Tekst i alerten
         */
        tekst: string
    }>
}

type Besøk = {
    name: 'besøk',
    properties: MakeExtendable<{
        /**
         * url på siden som ble besøkt
         */
        url: `https://${string}`,
        /**
         * Tekst i alerten
         */
        sidetittel: string
    }>
}

type ChatAvsluttet = {
    name: 'chat avsluttet',
    properties: MakeExtendable<{
        komponent: string
    }>
}

type ChatStartet = {
    name: 'chat startet',
    properties: MakeExtendable<{
        komponent: string
    }>
}

type FilterValg = {
    name: 'filter valg',
    properties: MakeExtendable<{
        /**
         * Tekst på filter som brukes
         */
        kategori: string
        /**
         * Tekst på filteralternativet som brukes
         */
        filternavn: string
        
    }>
}

type GuidePanelVist = {
    name: 'guidepanel vist',
    properties: MakeExtendable<{
        /**
         * statisk beskrivelse av hvilken komponent denne ligger i. Nyttig hvis teksten varierer.
         */
        komponent: string
        /**
         * Tekst på filteralternativet som brukes. Valgfri
         */
        tekst: string
        
    }>
}

export type AmplitudeEvent = AccordianÅpnet | AccordianLukket | AlertVist | Besøk | ChatAvsluttet | ChatStartet | FilterValg | GuidePanelVist;

// eslint-disable-next-line @typescript-eslint/ban-types
type AutocompleteString = string & {};
type EventName = AmplitudeEvent['name'];
type AutocompleteEventName = EventName | AutocompleteString;

type EventProperties<T extends AmplitudeEvent> = AmplitudeEvent['properties']

// Kan legge til function overrides for å gi mere info. Kanskje ikke nødvendig å legge til alle?


/**
 * En bruker åpnet en accordion
 * 
 * @link https://github.com/navikt/analytics-taxonomy/blob/main/events/accordion%20%C3%A5pnet/README.md
 * 
 */
// function logAmplitudeEvent<TName extends AccordianÅpnet['name']>(eventName: TName, eventData: AccordianÅpnet['properties']): void;

// /**
//  * En bruker lukket en accordian
//  * @link https://github.com/navikt/analytics-taxonomy/blob/main/events/accordion%20lukket/README.md
//  */
// function logAmplitudeEvent<TName extends AccordianLukket['name']>(eventName: TName, eventData: AccordianLukket['properties']): void;

// /**
//  * En bruker får vist en alert komponent fra designsystemet
//  * @link https://github.com/navikt/analytics-taxonomy/blob/main/events/alert%20vist/README.md
//  */
// function logAmplitudeEvent<TName extends AlertVist['name']>(eventName: TName, eventData: AlertVist['properties']): void;

// /**
//  * Når en bruker har besøkt en side. Inneholder URL brukeren besøkte. Denne event-typen følger med dekoratøren så team som bruker dekoratøren trenger ikke logge denne hendelsen i sin app.
// I Amplitude proxy berikes denne event-typen med URL og sidetittelen brukeren er på når besøk logges.
//  * @link https://github.com/navikt/analytics-taxonomy/blob/main/events/bes%C3%B8k/README.md
//  * @see https://github.com/navikt/nav-dekoratoren - Dekoratøren
//  * @see https://github.com/navikt/amplitude-proxy - Amplitude proxy
//  */
// function logAmplitudeEvent<TName extends Besøk['name']>(eventName: TName, eventData: Besøk['properties']): void;

// /**
//  *  Logs event to amplitude
//  */
// function logAmplitudeEvent<TName extends EventName>(eventName: TName, eventData: Extract<AmplitudeEvent, { name: TName }>['properties']): void;


// /**
//  *  Logs event to amplitude
//  */
// function logAmplitudeEvent<TName extends string>(eventName: TName, eventData: unknown): void;


/**
 *  Logs event to amplitude
 */
function logAmplitudeEvent<TName extends AutocompleteEventName>({
    eventName,
    eventData,
    origin = 'dekoratoren'
}: {
    eventName: TName,
    eventData: TName extends EventName ? Extract<AmplitudeEvent, { name: TName }>['properties'] : any
    origin: string
}) {
    console.log('Logging this event');
}


logAmplitudeEvent({
    eventName: 'accordian lukket',
    eventData: {
        tekst: 'hei'
    },
    origin: 'ok'
})