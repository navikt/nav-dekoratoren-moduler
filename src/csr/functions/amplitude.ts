import { AmplitudeEvent, AmplitudeEvents } from "../events";

export type AmplitudeParams = {
    origin: string;
    eventName: string;
    eventData?: Record<string, any>;
};

export type AutocompleteString = string & {};
export type AmplitudeEventName = AmplitudeEvents["name"];
export type AutocompleteEventName = AmplitudeEventName | AutocompleteString;

const throwawayLogger = () => {
    return Promise.resolve();
};

export async function logAmplitudeEvent<TName extends AmplitudeEventName>(_params: {
    eventName: TName | AutocompleteString;
    eventData?: TName extends AmplitudeEventName
        ? Extract<AmplitudeEvents, { name: TName }>["properties"]
        : Record<string, any>;
    origin: string;
}): Promise<any> {
    if (typeof window === "undefined") {
        return Promise.reject("Amplitude is only available in the browser");
    }

    console.info(
        "[DISCONTINUED] getAmplitudeInstance is discontinued and will be removed in the next major version. Please use getAnalyticsInstance instead.",
    );

    // Amplitude function is discontinued, so we just return a resolved promise
    return throwawayLogger();
}

export function getAmplitudeInstance<
    TCustomEvents extends AmplitudeEvent<string, Record<string, unknown>> = any,
>(_origin: string) {
    return <TName extends AutocompleteEventName>(
        // Can be set to never if we want to be more strict
        _eventName: TName extends AmplitudeEventName
            ? TName
            : TName extends TCustomEvents["name"]
              ? TName
              : TName,
        _eventData?: TName extends AmplitudeEventName
            ? Extract<AmplitudeEvents, { name: TName }>["properties"]
            : TName extends TCustomEvents["name"]
              ? Extract<TCustomEvents, { name: TName }>["properties"]
              : Record<string, any>,
    ) => {
        console.info(
            "[DISCONTINUED] getAmplitudeInstance is discontinued and will be removed in the next major version. Please use getAnalyticsInstance instead.",
        );
        return throwawayLogger;
    };
}
