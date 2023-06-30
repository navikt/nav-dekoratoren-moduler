export type AmplitudeParams = {
    origin: string;
    eventName: string;
    eventData?: Record<string, any>;
};

const waitForRetry = async () =>
    new Promise((resolve) => setTimeout(resolve, 500));

const validateAmplitudeFunction = async (retries = 5): Promise<boolean> => {
    if (typeof window.dekoratorenAmplitude === "function") {
        return Promise.resolve(true);
    }

    if (retries === 0) {
        return Promise.resolve(false);
    }

    await waitForRetry();

    return validateAmplitudeFunction(retries - 1);
};

export const logmplitudeEvent = async (
    params: AmplitudeParams
): Promise<any> => {
    if (typeof window === "undefined") {
        return Promise.reject("Amplitude is only available in the browser");
    }

    const isValid = await validateAmplitudeFunction();

    if (!isValid) {
        return Promise.reject(
            "Amplitude instance not found, it may not have been initialized yet"
        );
    }

    return window.dekoratorenAmplitude(params);
};

type MakeExtendable<T> = Partial<T> & Record<string, unknown>;

/**
 * En bruker åpnet en accordion
 */
export type AccordianÅpnet = {
    name: "accordian åpnet";
    properties: MakeExtendable<{
        /**
         * Tekst på accordian som åpnes.
         */
        tekst: string;
    }>;
};

/**
 * En bruker lukket en accordian
 */
type AccordianLukket = {
    name: "accordian lukket";
    properties: MakeExtendable<{
        /**
         * Tekst på accordian som lukkes.
         */
        tekst: string;
    }>;
};

/**
 * En bruker får vist en alert komponent fra designsystemet
 */
type AlertVist = {
    name: "alert vist";
    properties: MakeExtendable<{
        /**
         * Hvilken variant av alert. F.eks warning
         */
        variant: string;
        /**
         * Tekst i alerten
         */
        tekst: string;
    }>;
};

/**
 * Når en bruker har besøkt en side. Inneholder URL brukeren besøkte.
 * Denne event-typen følger med dekoratøren så team som bruker dekoratøren trenger ikke logge denne hendelsen i sin app.
 * I Amplitude proxy berikes denne event-typen med URL og sidetittelen brukeren er på når besøk logges.
 */
type Besøk = {
    name: "besøk";
    properties: MakeExtendable<{
        /**
         * url på siden som ble besøkt
         */
        url: `https://${string}`;
        /**
         * tittel på siden som ble besøkt
         */
        sidetittel: string;
    }>;
};

/**
 * en bruker avsluttet en chat
 */
type ChatAvsluttet = {
    name: "chat avsluttet";
    properties: MakeExtendable<{
        komponent: string;
    }>;
};

/**
 * en bruker starter en chat
 */
type ChatStartet = {
    name: "chat startet";
    properties: MakeExtendable<{
        komponent: string;
    }>;
};

/**
 * En bruker filtrerer visning av informasjon
 */
type FilterValg = {
    name: "filter valg";
    properties: MakeExtendable<{
        /**
         * Tekst på filter som brukes
         */
        kategori: string;
        /**
         * Tekst på filteralternativet som brukes
         */
        filternavn: string;
    }>;
};

/**
 * En bruker får vist en guidepanel komponent fra designsystemet
 */
type GuidePanelVist = {
    name: "guidepanel vist";
    properties: MakeExtendable<{
        /**
         * statisk beskrivelse av hvilken komponent denne ligger i. Nyttig hvis teksten varierer.
         */
        komponent: string;
        /**
         * Tekst på filteralternativet som brukes. Valgfri
         */
        tekst: string;
    }>;
};

/**
 * En innbygger laster ned noe. Et dokument fra sin innboks for eksempel, eller en excelfil med statistikk.
 */
type LastNed = {
    name: "last ned";
    properties: MakeExtendable<{
        /**
         * hva slags fil laster man ned? Saksdokument, statistikk
         */
        type: string;
        /**
         * hva handler vedlegget om? Dagpenger, Foreldrepenger
         */
        tema: string;
        /**
         * tittel på dokumentet som lastes ned
         */
        tittel: string;
    }>;
};

/**
 * En bruker lukket en modal
 */

type ModalLukket = {
    name: "modal lukket";
    properties: MakeExtendable<{
        /**
         * tekst på modal som lukkes
         */
        tekst: string;
    }>;
};

/**
 * En bruker åpnet en modal
 */
type ModalÅpnet = {
    name: "modal åpnet";
    properties: MakeExtendable<{
        /**
         * tekst på modal som åpnes
         */
        tekst: string;
    }>;
};

/**
 * Når en bruker har navigert, for eksempel når de trykker på en lenke.
 *
 * Denne følger med dekoratøren så alle klikk i dekoratøren er sporet i alle apper som bruker den.
 *
 * Team må legge til sporing av navigasjonen i sin egen app som de ønsker.
 *
 * Team bør legge til disse attributtene for mer verdi i dataene:
 *
 * - `destinasjon`: target URL brukeren sendes til
 * - `lenketekst`: teksten på lenken som brukeren trykker på
 *
 * Dette lar teamene se hvor brukeren var og hvor de gikk, og har historikk på hva som stod i lenketeksten.
 * Dette er nyttig når man eksperimenterer med ulike formuleringer for å gjøre det lettere for brukeren å finne frem og forstå innholdet.
 */
type Navigere = {
    name: "navigere";
    properties: MakeExtendable<{
        /**
         * teksten på lenken som brukeren trykker på
         */
        lenketekst: string;
        /**
         * target URL brukeren sendes til
         */
        destinasjon: string;
    }>;
};

type Skjema = {
    /**
     * navn på skjema
     */
    skjemanavn: string;
    /**
     * ID på skjemaet
     */
    skjemaId: string;
};

/**
 * En bruker har sendt inn et skjema.
 */
type SkjemaFullført = {
    name: "skjema fullført";
    properties: MakeExtendable<Skjema>;
};

/**
 * En bruker prøvde å sende inn et skjema og noe gikk galt.
 * For eksempel når vår server er nede eller noe ikke kan svare tidsnok for å sende inn et skjema.
 */
type SkjemaInnsendingFeilet = {
    name: "skjerma innsending feilet";
    properties: MakeExtendable<Skjema>;
};

/**
 * En bruker har besvart et spørsmål i et skjema.
 */
type SkjemaSpørsmålBesvart = {
    name: "skjema spørsmål besvart";
    properties: MakeExtendable<
        Skjema & {
            /**
             * spørsmålet som ble stilt
             */
            spørsmål: string;
            /**
             * spørsmålet som ble stilt
             */
            svar: string;
        }
    >;
};

/**
 * En bruker har startet å fylle ut et skjema.
 */
type SkjemaStartet = {
    name: "skjema startet";
    properties: MakeExtendable<Skjema>;
};

/**
 * En bruker har fullført et steg i utfylling i et skjema.
 * Kan brukes når et skjema består av flere steg, for eksempel mange spørsmål.
 */
type SkjemaStegFullført = {
    name: "skjema startet";
    properties: MakeExtendable<
        Skjema & {
            /**
             * steg i skjemautfylling
             */
            steg: number;
        }
    >;
};

/**
 * En bruker har fullført et steg i utfylling i et skjema.
 * Kan brukes når et skjema består av flere steg, for eksempel mange spørsmål.
 */
type SkjemaValideringFeilet = {
    name: "skjema validering feilet";
    properties: MakeExtendable<Skjema>;
};

/**
 * En bruker åpnet et skjema
 */
type SkjemaÅpnet = {
    name: "skjema åpnet";
    properties: MakeExtendable<Skjema>;
};

/**
 * Et søk er sendt inn
 */
type Søk = {
    name: "søk";
    properties: MakeExtendable<{
        /**
         * tjenste-url som benyttes til søket
         */
        destinasjon: string;
        /**
         * streng som sendes inn til søket
         */
        søkeord: string;
        /**
         * navn på komponent søket utføres fra (hvis relevant)
         */
        komponent: string;
    }>;
};

export type PredefinedEvents =
    | AccordianÅpnet
    | AccordianLukket
    | AlertVist
    | Besøk
    | ChatAvsluttet
    | ChatStartet
    | FilterValg
    | GuidePanelVist
    | LastNed
    | ModalLukket
    | ModalÅpnet
    | Navigere
    | SkjemaFullført
    | SkjemaInnsendingFeilet
    | SkjemaSpørsmålBesvart
    | SkjemaStartet
    | SkjemaStegFullført
    | SkjemaValideringFeilet
    | SkjemaÅpnet
    | Søk;

// Mulig for å legge til custom types
export type AmplitudeEvent = PredefinedEvents | NDM.CustomEvents;

// eslint-disable-next-line @typescript-eslint/ban-types
type AutocompleteString = string & {};
export type AmplitudeEventName = AmplitudeEvent["name"];
export type AutocompleteEventName = AmplitudeEventName | AutocompleteString;

//@TODO: Skriv en oneliner om når man burde bruke de ulike

/**
 * This function logs an event to Amplitude. It validates the Amplitude instance before logging the event.
 *
 * @param params - An object containing the parameters for the event.
 * @param params.eventName - The name of the event to log, extends from {@link AutocompleteEventName}.
 * @param params.eventData - The data of the event, it's an optional parameter. If `eventName` is an instance of {@link AmplitudeEventName}, it should match the corresponding event's properties.
 * @param params.origin - The origin of the event, usually the component or module where the event was triggered.
 *
 * @throws Will throw an error if called server-side.
 * @throws Will throw an error if Amplitude instance is not found or has not been initialized yet.
 *
 * @returns A promise that resolves with the result of the `dekoratorenAmplitude` function.
 *
 * @see {@link AccordianÅpnet}
 * @see {@link AccordianLukket}
 * @see {@link AlertVist}
 * @see {@link Besøk}
 * @see {@link ChatAvsluttet}
 * @see {@link ChatStartet}
 * @see {@link FilterValg}
 * @see {@link GuidePanelVist}
 * @see {@link LastNed}
 * @see {@link ModalLukket}
 * @see {@link ModalÅpnet}
 * @see {@link Navigere}
 * @see {@link SkjemaFullført}
 * @see {@link SkjemaInnsendingFeilet}
 * @see {@link SkjemaSpørsmålBesvart}
 * @see {@link SkjemaStartet}
 * @see {@link SkjemaStegFullført}
 * @see {@link SkjemaValideringFeilet}
 * @see {@link SkjemaÅpnet}
 * @see {@link Søk}
 *
 *
 * @async
 * @function
 * @exports logAmplitudeEvent
 */
export async function logAmplitudeEvent<
    TName extends AutocompleteEventName
>(params: {
    eventName: TName;
    eventData?: TName extends AmplitudeEventName
        ? Extract<AmplitudeEvent, { name: TName }>["properties"]
        : any;
    origin: string;
}): Promise<any> {
    if (typeof window === "undefined") {
        return Promise.reject("Amplitude is only available in the browser");
    }

    const isValid = await validateAmplitudeFunction();

    if (!isValid) {
        return Promise.reject(
            "Amplitude instance not found, it may not have been initialized yet"
        );
    }

    return window.dekoratorenAmplitude(params);
}

export function createAmplitudeInstance<TOrigin extends string>(
    origin: TOrigin
) {
    return <TName extends AutocompleteEventName>(
        eventName: TName,
        eventData?: TName extends AmplitudeEventName
            ? Extract<AmplitudeEvent, { name: TName }>["properties"]
            : any
    ) => {
        return logAmplitudeEvent({
            eventName,
            eventData,
            origin,
        });
    };
}
