import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { addDecoratorUpdateListener } from "./decorator-version-watcher";

describe("Version watcher", () => {
    enableFetchMocks();
    jest.useFakeTimers();

    beforeEach(() => {
        fetchMock.resetMocks();
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

            jest.runOnlyPendingTimers();
        });
    });
});
