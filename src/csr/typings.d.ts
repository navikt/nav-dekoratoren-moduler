declare global {
    export namespace NDM {
        // type origin = "dekoratoren";
        export type CustomEvent<
            TName extends string,
            TProperties extends Record<string, unknown>
        > = {
            name: TName;
            properties: TProperties;
        };
        // Bruke for å definere egene types i CustomEvents union
        export type CustomEvents = CustomEvent<
            "hei",
            {
                heisann: string;
            }
        >;
    }
    interface Window {
        dekoratorenAmplitude: ({
            origin,
            eventName,
            eventData,
        }?: {
            origin: string;
            eventName: string;
            eventData?: EventData;
        }) => Promise<any>;
    }
}

export {};
