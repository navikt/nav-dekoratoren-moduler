import { AmplitudeEvent, AmplitudeEvents } from "../events";

/*
    Information on discontinuation:
    Starting 01.11.2025, Amplitude has been discontinued in Nav. Teams have had several months to migrate
    to the new Umami regime, however in order to prevent breaking changes, the functions below
    are still exposed, but now give DISCONTINUED warnings as well as silently throwing away any events.
*/

export type AmplitudeParams = {
    origin: string;
    eventName: string;
    eventData?: Record<string, any>;
};

export type AutocompleteString = string & {};
export type AmplitudeEventName = AmplitudeEvents["name"];
export type AutocompleteEventName = AmplitudeEventName | AutocompleteString;

const amplitudeDummy = () => {
    return Promise.resolve();
};

export async function logAmplitudeEvent<TName extends AmplitudeEventName>(params: {
    eventName: TName | AutocompleteString;
    eventData?: TName extends AmplitudeEventName
        ? Extract<AmplitudeEvents, { name: TName }>["properties"]
        : Record<string, any>;
    origin: string;
}): Promise<any> {
    if (typeof window === "undefined") {
        return Promise.reject("Amplitude is only available in the browser");
    }

    console.warn(
        "[DISCONTINUED] getAmplitudeInstance is discontinued and will be removed in the next major version. Please use getAnalyticsInstance instead.",
    );

    return amplitudeDummy;
}

export function getAmplitudeInstance<
    TCustomEvents extends AmplitudeEvent<string, Record<string, unknown>> = any,
>(origin: string) {
    console.warn(
        "[DISCONTINUED] getAmplitudeInstance is discontinued and will be removed in the next major version. Please use getAnalyticsInstance instead.",
    );
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
              : Record<string, any>,
    ) => {
        return amplitudeDummy();
    };
}
