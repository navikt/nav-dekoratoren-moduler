import { AmplitudeEvent, AmplitudeEvents } from "../events";

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

export type AutocompleteString = string & {};
export type AmplitudeEventName = AmplitudeEvents["name"];
export type AutocompleteEventName = AmplitudeEventName | AutocompleteString;

export async function logAmplitudeEvent<
    TName extends AutocompleteEventName
>(params: {
    eventName: TName;
    eventData?: TName extends AmplitudeEventName
        ? Extract<AmplitudeEvents, { name: TName }>["properties"]
        : Record<string, any>;
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

export function getAmplitudeInstance<
    TCustomEvents extends AmplitudeEvent<string, Record<string, unknown>> = any
>(origin: string) {
    return <TName extends AutocompleteEventName>(
        // Can be set to never if we want to be more strict
        eventName: TName extends AmplitudeEventName
            ? TName
            : TName extends TCustomEvents["name"]
            ? TName
            : TName,
        eventData?: TName extends AmplitudeEventName
            ? Extract<AmplitudeEvents, { name: TName }>["properties"]
            : TName extends TCustomEvents["name"]
            ? Extract<TCustomEvents, { name: TName }>["properties"]
            : Record<string, any>
    ) => {
        return logAmplitudeEvent({
            eventName,
            eventData,
            origin,
        });
    };
}
