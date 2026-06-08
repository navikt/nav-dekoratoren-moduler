import { afterEach, describe, expect, test, vi } from "vitest";
import { logAnalyticsCustomEvent, logAnalyticsEvent } from "./analytics";

describe("analytics", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test("Should tag typed analytics events with decorator client metadata", async () => {
        const dekoratorenAnalytics = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal("window", { dekoratorenAnalytics });

        await logAnalyticsEvent({
            origin: "test-app",
            eventName: "navigere",
        });

        expect(dekoratorenAnalytics).toHaveBeenCalledWith({
            origin: "test-app",
            eventName: "navigere",
            eventData: undefined,
            decoratorModulerAnalyticsEntryPoint: "typed",
        });
    });

    test("Should tag custom analytics events with decorator client metadata", async () => {
        const dekoratorenAnalytics = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal("window", { dekoratorenAnalytics });

        await logAnalyticsCustomEvent({
            origin: "test-app",
            eventName: "custom-event",
        });

        expect(dekoratorenAnalytics).toHaveBeenCalledWith({
            origin: "test-app",
            eventName: "custom-event",
            decoratorModulerAnalyticsEntryPoint: "custom",
        });
    });
});
