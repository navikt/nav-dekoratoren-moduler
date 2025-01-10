declare global {
    interface Window {
        dekoratorenAmplitude: ({
            origin,
            eventName,
            eventData,
        }?: {
            origin: string;
            eventName: string;
            eventData?: Record<string, any>;
        }) => Promise<any>;
        __DECORATOR_DATA__: any;
    }
}

export {};
