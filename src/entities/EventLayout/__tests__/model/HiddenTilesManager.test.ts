import { describe, it, expect, beforeEach } from "vitest";
import { IEvent, IVerticalBoundaries } from "@shared/typings";
import { Sizes } from "@shared/config";
import { HiddenTilesManager } from "../../model/HiddenTilesManager";
import { Tile } from "../../model/Tile";

const mockEvent = (id: string, start: Date, end: Date): IEvent => ({
    id,
    title: `Event ${id}`,
    start,
    end
});

const createTile = (start: Date, end: Date, left = 0, width = 100) => {
    const tile = new Tile(mockEvent("1", start, end));
    tile.left = left;
    tile.width = width;
    return tile;
};

describe("Entities/EventLayout/model/HiddenTilesManager", () => {
    let manager: HiddenTilesManager;
    let tileA: Tile;
    let tileB: Tile;
    let tileC: Tile;

    beforeEach(() => {
        manager = new HiddenTilesManager();

        tileA = createTile(new Date("2023-10-01T10:15"), new Date("2023-10-01T11:00")); // 10:15-11:00
        tileB = createTile(new Date("2023-10-01T10:20"), new Date("2023-10-01T10:45")); // 10:20-10:45
        tileC = createTile(new Date("2023-10-01T11:30"), new Date("2023-10-01T12:00")); // 11:30-12:00
    });

    describe("registerHiddenKey", () => {
        it("Must register a new tile and create a key", () => {
            const key = manager.registerHiddenKey(tileA);

            expect(key).toEqual({
                top: expect.any(Number),
                bottom: expect.any(Number)
            });
            expect(tileA.hiddenKey).toEqual(key);
            expect(manager.hiddenTilesMap.has(key)).toBe(true);
        });

        it("Must use an existing key when there is a time overlap", () => {
            // Both tiles fall within the interval of 10:00-10:30
            const keyA = manager.registerHiddenKey(tileA);
            const keyB = manager.registerHiddenKey(tileB);
            expect(keyA).toEqual(keyB);
            expect(manager.hiddenKeys.length).toBe(1);
        });

        it("Must create different keys for tiles that do not overlap in time", () => {
            const keyA = manager.registerHiddenKey(tileA); // 10:00-10:30
            const keyC = manager.registerHiddenKey(tileC); // 11:30-12:00

            expect(keyA).not.toEqual(keyC);
            expect(manager.hiddenKeys.length).toBe(2);
        });

        it("Must take into account the time limits", () => {
            const tileEdge = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:00"));
            const keyA = manager.registerHiddenKey(tileA); // 10:00-10:30
            const keyEdge = manager.registerHiddenKey(tileEdge); // 10:30-11:00

            expect(keyA).not.toEqual(keyEdge);
            expect(manager.hiddenKeys.length).toBe(2);
        });
    });

    describe("addTile and removeTile", () => {
        it("Must add and remove tiles", () => {
            const key = manager.registerHiddenKey(tileA);

            expect(manager.addTile(tileA)).toBe(true);
            expect(manager.getTilesByKey(key)).toEqual([tileA]);

            expect(manager.removeTile(tileA)).toBe(true);
            expect(manager.getTilesByKey(key)).toEqual([]);
        });

        it("Must not add a tile with an unregistered key", () => {
            expect(manager.addTile(tileA)).toBe(false);
            expect(manager.hiddenTiles).toEqual([]);
        });
    });

    describe("getTilesByKey", () => {
        it("Must return tiles by key", () => {
            const key = manager.registerHiddenKey(tileA);
            manager.registerHiddenKey(tileB);
            manager.addTile(tileA);
            manager.addTile(tileB);

            expect(manager.getTilesByKey(key).length).toBe(2);
        });
    });

    describe("hasHiddenInRange", () => {
        it("Should return true if there are hidden tiles in the range", () => {
            manager.registerHiddenKey(tileA);
            manager.addTile(tileA);

            const range: IVerticalBoundaries = {
                top: tileA.hiddenKey.top - 10,
                bottom: tileA.hiddenKey.bottom + 10
            };

            expect(manager.hasHiddenInRange(range)).toBe(true);
        });

        it("Should return false if there are no tiles in the range.", () => {
            manager.registerHiddenKey(tileA);
            manager.addTile(tileA);

            const range: IVerticalBoundaries = {
                top: tileA.hiddenKey.top + 100,
                bottom: tileA.hiddenKey.bottom + 200
            };

            expect(manager.hasHiddenInRange(range)).toBe(false);
        });
    });

    describe("hiddenTiles", () => {
        it("Must return all hidden tiles.", () => {
            manager.registerHiddenKey(tileA);
            manager.registerHiddenKey(tileC);
            manager.addTile(tileA);
            manager.addTile(tileC);
            expect(manager.hiddenTiles).toEqual([tileC, tileA]);
        });
    });

    describe("hiddenKeys", () => {
        it("Must return keys with hidden tiles", () => {
            const keyA = manager.registerHiddenKey(tileA);
            const keyC = manager.registerHiddenKey(tileC);
            manager.addTile(tileA);

            expect(manager.hiddenKeys).toEqual([keyA, keyC]);
        });
    });

    describe("createKeyForTile", () => {
        it("Must create a key rounded up to half an hour", () => {
            // 10:15 -> rounded up to 10:00-10:30
            const key = manager.registerHiddenKey(tileA);

            expect(key.top).toBe(10 * 60 * (Sizes.ROW_HEIGHT / 60));
            expect(key.bottom).toBe(key.top + Sizes.ROW_HEIGHT / 2);
        });

        it("It should round up the time to half an hour.", () => {
            // 10:45 a.m. -> rounded up to 10:30-11:00
            const tile = createTile(new Date("2023-10-01T10:45"), new Date("2023-10-01T11:30"));
            const key = manager.registerHiddenKey(tile);

            expect(key.top).toBe((10 * 60 + 30) * (Sizes.ROW_HEIGHT / 60));
        });
    });

    describe("Complex scenarios", () => {
        it("It must correctly group tiles by time intervals", () => {
            // All tiles are in the range of 10:00-10:30
            const tile1 = createTile(new Date("2023-10-01T10:05"), new Date("2023-10-01T10:10"));
            const tile2 = createTile(new Date("2023-10-01T10:15"), new Date("2023-10-01T10:20"));
            const tile3 = createTile(new Date("2023-10-01T10:25"), new Date("2023-10-01T10:30"));

            // Tiles in a different interval
            const tile4 = createTile(new Date("2023-10-01T11:00"), new Date("2023-10-01T11:15"));

            manager.registerHiddenKey(tile1);
            manager.registerHiddenKey(tile2);
            manager.registerHiddenKey(tile3);
            manager.registerHiddenKey(tile4);

            manager.addTile(tile1);
            manager.addTile(tile2);
            manager.addTile(tile3);
            manager.addTile(tile4);

            // There must be 2 keys
            expect(manager.hiddenKeys.length).toBe(2);

            // There should be 3 tiles in the first key
            const firstKey = manager.hiddenKeys[0];
            expect(manager.getTilesByKey(firstKey).length).toBe(3);
        });

        it("It must update the state correctly when tiles are deleted", () => {
            const keyA = manager.registerHiddenKey(tileA);
            const keyB = manager.registerHiddenKey(tileB);

            manager.addTile(tileA);
            manager.addTile(tileB);

            manager.removeTile(tileA);

            expect(manager.getTilesByKey(keyA)).toEqual([tileB]);
            expect(manager.getTilesByKey(keyB)).toEqual([tileB]);
            expect(manager.hiddenTiles).toEqual([tileB]);
        });
    });
});
