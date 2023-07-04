import { AmplitudeEvent } from "../events";

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

// eslint-disable-next-line @typescript-eslint/ban-types
type AutocompleteString = string & {};
export type AmplitudeEventName = AmplitudeEvent["name"];
export type AutocompleteEventName = AmplitudeEventName | AutocompleteString;

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
