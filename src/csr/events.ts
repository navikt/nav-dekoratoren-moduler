type MakeExtendable<T> = Partial<T> & Record<string, unknown>;

/**
 * En type helper for å definere amplitude eventer.
 */
export type AmplitudeEvent<TName extends string, TProperties> = {
    name: TName;
    properties: MakeExtendable<TProperties>;
};

/**
 * En bruker åpnet en accordion
 */
export type AccordionÅpnet = AmplitudeEvent<
    "accordion åpnet",
    {
        /**
         * Tekst på accordian som åpnes.
         */
        tekst: string;
    }
>;

/**
 * En bruker lukket en accordian
 */
type AccordionLukket = AmplitudeEvent<
    "accordion lukket",
    {
        /**
         * Tekst på accordian som lukkes.
         */
        tekst: string;
    }
>;

/**
 * En bruker får vist en alert komponent fra designsystemet
 */
type AlertVist = AmplitudeEvent<
    "alert vist",
    {
        /**
         * Hvilken variant av alert. F.eks warning
         */
        variant: string;
        /**
         * Tekst i alerten
         */
        tekst: string;
    }
>;

/**
 * Når en bruker har besøkt en side. Inneholder URL brukeren besøkte.
 * Denne event-typen følger med dekoratøren så team som bruker dekoratøren trenger ikke logge denne hendelsen i sin app.
 * I Amplitude proxy berikes denne event-typen med URL og sidetittelen brukeren er på når besøk logges.
 */
type Besøk = AmplitudeEvent<
    "besøk",
    {
        /**
         * url på siden som ble besøkt
         */
        url: string;
        /**
         * tittel på siden som ble besøkt
         */
        sidetittel: string;
    }
>;

/**
 * Brukeren avslutter chatten med oss
 */
type ChatAvsluttet = AmplitudeEvent<
    "chat avsluttet",
    {
        komponent: string;
    }
>;

/**
 * Brukeren starter en chat dialog med oss
 */
type ChatStartet = AmplitudeEvent<
    "chat startet",
    {
        komponent: string;
    }
>;

/**
 * En bruker filtrerer visning av informasjon
 */
type FilterValg = AmplitudeEvent<
    "filter valg",
    {
        /**
         * Tekst på filter som brukes
         */
        kategori: string;
        /**
         * Tekst på filteralternativet som brukes
         */
        filternavn: string;
    }
>;

/**
 * En bruker får vist en guidepanel komponent fra designsystemet
 */
type GuidePanelVist = AmplitudeEvent<
    "guidepanel vist",
    {
        /**
         * statisk beskrivelse av hvilken komponent denne ligger i. Nyttig hvis teksten varierer.
         */
        komponent: string;
        /**
         * Tekst på filteralternativet som brukes. Valgfri
         */
        tekst: string;
    }
>;

/**
 * En innbygger laster ned noe. Et dokument fra sin innboks for eksempel, eller en excelfil med statistikk.
 */
type LastNed = AmplitudeEvent<
    "last ned",
    {
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
    }
>;

/**
 * En bruker lukket en modal
 */
type ModalLukket = AmplitudeEvent<
    "modal lukket",
    {
        /**
         * tekst på modal som lukkes
         */
        tekst: string;
    }
>;

/**
 * En bruker åpnet en modal
 */
type ModalÅpnet = AmplitudeEvent<
    "modal åpnet",
    {
        /**
         * tekst på modal som åpnes
         */
        tekst: string;
    }
>;

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
type Navigere = AmplitudeEvent<
    "navigere",
    {
        /**
         * teksten på lenken som brukeren trykker på
         */
        lenketekst: string;
        /**
         * target URL brukeren sendes til
         */
        destinasjon: string;
    }
>;

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
type SkjemaFullført = AmplitudeEvent<"skjema fullført", Skjema>;

/**
 * En bruker prøvde å sende inn et skjema og noe gikk galt.
 * For eksempel når vår server er nede eller noe ikke kan svare tidsnok for å sende inn et skjema.
 */
type SkjemaInnsendingFeilet = AmplitudeEvent<
    "skjema innsending feilet",
    Skjema
>;

/**
 * En bruker har besvart et spørsmål i et skjema.
 */
type SkjemaSpørsmålBesvart = AmplitudeEvent<
    "skjema spørsmål besvart",
    Skjema & {
        /**
         * spørsmålet som ble stilt
         */
        spørsmål: string;
        /**
         * svaret bruker oppga
         */
        svar: string;
    }
>;

/**
 * En bruker har startet å fylle ut et skjema.
 */
type SkjemaStartet = AmplitudeEvent<"skjema startet", Skjema>;

/**
 * En bruker har fullført et steg i utfylling i et skjema.
 * Kan brukes når et skjema består av flere steg, for eksempel mange spørsmål.
 */
type SkjemaStegFullført = AmplitudeEvent<
    "skjema steg fullført",
    Skjema & {
        /**
         * steg i skjemautfylling
         */
        steg: number;
    }
>;

/**
 * En bruker har fullført et steg i utfylling i et skjema.
 * Kan brukes når et skjema består av flere steg, for eksempel mange spørsmål.
 */
type SkjemaValideringFeilet = AmplitudeEvent<
    "skjema validering feilet",
    Skjema
>;

/**
 * En bruker åpnet et skjema
 */
type SkjemaÅpnet = AmplitudeEvent<"skjema åpnet", Skjema>;

/**
 * Et søk er sendt inn
 */
type Søk = AmplitudeEvent<
    "søk",
    {
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
    }
>;

export type PredefinedEvents =
    | AccordionÅpnet
    | AccordionLukket
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
export type AmplitudeEvents = PredefinedEvents;
