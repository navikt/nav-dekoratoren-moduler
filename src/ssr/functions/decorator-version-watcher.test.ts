import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import {
    addDecoratorUpdateListener,
    clearDecoratorWatcherState,
} from "./decorator-version-watcher";

describe("Version watcher", () => {
    enableFetchMocks();
    jest.useFakeTimers();

    beforeEach(() => {
        fetchMock.resetMocks();
        clearDecoratorWatcherState();
    });

    test("Should get a callback on new decorator version", (done) => {
        const callback = jest.fn((versionId: string) => {
            expect(versionId).toBe("version2");
            done();
        });

        fetchMock.mockResponseOnce(
            JSON.stringify({
                latestVersion: "version1",
            }),
        );

        addDecoratorUpdateListener({ env: "prod" }, callback).then(() => {
            fetchMock.mockResponseOnce(
                JSON.stringify({
                    latestVersion: "version2",
                }),
            );

            fetchMock.mockResponseOnce(
                JSON.stringify({ headAssets: "a", header: "b", footer: "c", scripts: "d" }),
            );

            jest.runOnlyPendingTimers();
        });
    });
});

test("debug: logs fingerprint change (no callback yet)", async () => {
    fetchMock.resetMocks();
    clearDecoratorWatcherState();
    jest.useFakeTimers();

    //init watcher with version 1
    fetchMock.mockResponseOnce(JSON.stringify({ latestVersion: "version1" }));
    await addDecoratorUpdateListener({ env: "prod" }, () => {});

    // tick 1: same version, baseline SSR
    fetchMock.mockResponseOnce(JSON.stringify({ latestVersion: "version1" }));
    fetchMock.mockResponseOnce(
        JSON.stringify({ headAssets: "aa", header: "b", footer: "c", scripts: "d" }),
    );
    jest.runOnlyPendingTimers();

    // tick 2: same version, change footer - fingerprint should change to 2|1|2|1
    fetchMock.mockResponseOnce(JSON.stringify({ latestVersion: "version1" }));
    fetchMock.mockResponseOnce(
        JSON.stringify({ headAssets: "aa", header: "b", footer: "cc", scripts: "d" }),
    );
    jest.runOnlyPendingTimers();
});
