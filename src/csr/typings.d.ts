declare global {
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
