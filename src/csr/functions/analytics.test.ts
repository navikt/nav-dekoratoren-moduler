import { afterEach, describe, expect, test, vi } from "vitest";
import { logAnalyticsEvent } from "./analytics";

describe("analytics", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test("Should tag analytics events with legacy decorator moduler metadata", async () => {
        const dekoratorenAnalytics = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal("window", { dekoratorenAnalytics });

        await logAnalyticsEvent({
            origin: "test-app",
            eventName: "navigere",
        });

        expect(dekoratorenAnalytics).toHaveBeenCalledWith({
            origin: "test-app",
            eventName: "navigere",
            decoratorModulerAnalyticsEntryPoint: "legacy",
        });
    });
});
