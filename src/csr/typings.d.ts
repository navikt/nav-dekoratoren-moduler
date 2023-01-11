declare global {
    interface Window {
        dekoratorenAmplitude: ({
            appName,
            eventName,
            eventData,
        }?: {
            appName: string;
            eventName: string;
            eventData?: EventData;
        }) => Promise<any>;
    }
}

export {};
