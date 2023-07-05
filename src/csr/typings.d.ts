declare global {
    interface Window {
        dekoratorenAmplitude: ({
            origin,
            eventName,
            eventData,
        }?: {
            origin: string;
            eventName: any;
            eventData?: any;
        }) => Promise<any>;
    }
}

export {};
