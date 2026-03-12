import { vi } from "vitest";
import {
    addDecoratorUpdateListener,
    clearDecoratorWatcherState,
} from "./decorator-version-watcher";

describe("Version watcher", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        fetchMock.resetMocks();
        clearDecoratorWatcherState();
    });

    afterEach(() => {
        clearDecoratorWatcherState();
        vi.clearAllTimers();
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    test("Should get a callback on new decorator version", async () => {
        const callback = vi.fn();

        fetchMock.mockResponseOnce(
            JSON.stringify({
                latestVersion: "version1",
            }),
        );

        await addDecoratorUpdateListener({ env: "prod" }, callback);

        fetchMock.mockResponseOnce(
            JSON.stringify({
                latestVersion: "version2",
            }),
        );

        await vi.runOnlyPendingTimersAsync();

        expect(callback).toHaveBeenCalledWith("version2");
    });
});
