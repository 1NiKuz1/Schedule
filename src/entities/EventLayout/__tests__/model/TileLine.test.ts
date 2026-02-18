import { describe, it, expect, beforeEach, vi } from "vitest";
import { IEvent } from "@shared/typings";
import { TileLine } from "../../model/TileLine";
import { Tile } from "../../model/Tile";
import { BoundaryUtils } from "../../lib";

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

describe("Entities/EventLayout/model/TileLine", () => {
    let line: TileLine;
    let tileA: Tile;
    let tileB: Tile;
    let tileC: Tile;

    beforeEach(() => {
        line = new TileLine({
            left: 0,
            right: 100,
            top: 20,
            bottom: 100
        });

        tileA = createTile(new Date("2023-10-01T00:30"), new Date("2023-10-01T01:30"), 0, 30);
        tileB = createTile(new Date("2023-10-01T01:00"), new Date("2023-10-01T02:00"), 40, 30);
        tileC = createTile(new Date("2023-10-01T00:00"), new Date("2023-10-01T01:00"), 80, 20);
    });

    describe("Constructor", () => {
        it("Must initialize properties", () => {
            expect(line.boundaries).toEqual({
                left: 0,
                right: 100,
                top: 20,
                bottom: 100
            });
            expect(line.tiles).toEqual([]);
        });
    });

    describe("addTile", () => {
        it("Must add tiles and update vertical borders", () => {
            line.addTile(tileA);
            expect(line.tiles).toContain(tileA);
            expect(line.boundaries).toEqual({
                left: 0,
                right: 100,
                top: 20,
                bottom: 100
            });
            expect(tileA.lineKey).toEqual(line.boundaries);
        });

        it("Must expand the vertical borders when adding tiles", () => {
            line.addTile(tileB);

            expect(line.boundaries).toEqual({
                left: 0,
                right: 100,
                top: 20,
                bottom: 134
            });
        });

        it("Must expand the boundaries in both directions", () => {
            line.addTile(tileC);
            line.addTile(tileB);

            expect(line.boundaries).toEqual({
                left: 0,
                right: 100,
                top: 0,
                bottom: 134
            });
        });

        it("Must not add duplicates", () => {
            line.addTile(tileA);
            line.addTile(tileA);

            expect(line.tiles.length).toBe(1);
        });
    });

    describe("removeTile", () => {
        it("Must remove tiles and update vertical borders", () => {
            line.addTile(tileA);
            line.addTile(tileB);

            expect(line.boundaries.bottom).toBe(134);

            line.removeTile(tileB);

            expect(line.tiles).not.toContain(tileB);
            expect(line.tiles).toContain(tileA);
            expect(line.tiles.length).toBe(1);

            expect(line.boundaries).toEqual({
                left: 0,
                right: 100,
                top: 34,
                bottom: 100
            });
        });

        it("Should reset the borders when all tiles are removed", () => {
            line.addTile(tileA);
            line.removeTile(tileA);

            expect(line.boundaries).toEqual({
                left: 0,
                right: 100,
                top: 0,
                bottom: 0
            });
        });

        it("It should not fall when removing non-existent tiles", () => {
            expect(() => line.removeTile(tileA)).not.toThrow();
        });

        it("It must update the borders correctly when removing tiles", () => {
            line.addTile(tileA);
            line.addTile(tileB);
            line.addTile(tileC);

            expect(line.boundaries.top).toBe(0);
            expect(line.boundaries.bottom).toBe(134);

            line.removeTile(tileC);

            expect(line.boundaries.top).toBe(34);
            expect(line.boundaries.bottom).toBe(134);

            line.removeTile(tileB);

            expect(line.boundaries.top).toBe(34);
            expect(line.boundaries.bottom).toBe(100);
        });

        it("Must delete neighbors and connections when deleting", () => {
            line.addTile(tileA);
            line.addTile(tileB);
            line.addTile(tileC);

            tileA.next = [tileB];
            tileA.overlaps = [tileB, tileC];
            tileB.prev = [tileA];
            tileB.next = [tileC];
            tileB.overlaps = [tileA, tileC];
            tileC.prev = [tileB];
            tileC.overlaps = [tileB, tileA];

            line.removeTile(tileB);

            expect(line.tiles.includes(tileB)).toBe(false);
            expect(tileA.next.includes(tileB)).toBe(false);
            expect(tileA.overlaps.includes(tileB)).toBe(false);
            expect(tileB.next.length).toBe(0);
            expect(tileB.prev.length).toBe(0);
            expect(tileB.overlaps.length).toBe(0);
            expect(tileC.prev.includes(tileB)).toBe(false);
            expect(tileC.overlaps.includes(tileB)).toBe(false);
        });
    });

    describe("overwriteHorizontalBoundaries", () => {
        it("It should update only the horizontal borders", () => {
            line.addTile(tileA);

            line.overwriteHorizontalBoundaries({ left: 10, right: 90 });

            expect(line.boundaries).toEqual({
                left: 10,
                right: 90,
                top: 20,
                bottom: 100
            });
        });

        it("Must redistribute tiles", () => {
            const distributeSpy = vi.spyOn(BoundaryUtils, "distributeTilesUniformly");

            line.addTile(tileA);
            line.addTile(tileB);

            line.overwriteHorizontalBoundaries({ left: 10, right: 90 });

            expect(distributeSpy).toHaveBeenCalledWith([tileA, tileB], { left: 10, right: 90 });

            distributeSpy.mockRestore();
        });

        it("Must update the lineKey of the tiles when the boundaries of the line change", () => {
            line.addTile(tileA);
            const originalKey = { ...line.boundaries };

            line.overwriteHorizontalBoundaries({ left: 10, right: 90 });

            expect(tileA.lineKey).not.toEqual(originalKey);
            expect(tileA.lineKey).toEqual(line.boundaries);
        });
    });

    describe("getLineVerticalBoundariesBasedTiles", () => {
        it("Must correctly calculate tile boundaries", () => {
            line.addTile(tileA);
            line.addTile(tileB);
            line.addTile(tileC);

            const boundaries = line["getLineVerticalBoundariesBasedTiles"]();
            expect(boundaries).toEqual({
                top: 0,
                bottom: 134
            });
        });

        it("Should return zero borders if there are no tiles", () => {
            const boundaries = line["getLineVerticalBoundariesBasedTiles"]();

            expect(boundaries).toEqual({
                top: 0,
                bottom: 0
            });
        });
    });

    describe("Complex scenarios", () => {
        it("Must correctly handle sequential addition/deletion", () => {
            line.addTile(tileA);
            line.addTile(tileB);

            tileA.next = [tileB];
            tileA.overlaps = [tileB];
            tileB.prev = [tileA];
            tileB.overlaps = [tileA];

            expect(line.tiles.length).toBe(2);
            expect(line.boundaries.bottom).toBe(134);

            line.removeTile(tileA);

            expect(tileA.next.includes(tileB)).toBe(false);
            expect(tileA.overlaps.includes(tileB)).toBe(false);
            expect(tileB.prev.includes(tileA)).toBe(false);
            expect(tileB.overlaps.includes(tileA)).toBe(false);

            expect(line.tiles.length).toBe(1);
            expect(line.boundaries.top).toBe(68);

            const tileD = createTile(new Date("2023-10-01T00:30"), new Date("2023-10-01T01:20"));
            line.addTile(tileD);

            expect(line.tiles.length).toBe(2);
            expect(line.boundaries.top).toBe(34);
        });
    });
});
