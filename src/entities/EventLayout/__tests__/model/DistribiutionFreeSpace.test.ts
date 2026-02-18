import { describe, it, expect, beforeEach } from "vitest";
import { IEvent, IBoundaries } from "@shared/typings";
import { DistributionFreeSpace } from "../../model/DistributionFreeSpace";
import { HiddenTilesManager } from "../../model/HiddenTilesManager";
import { TilesLines } from "../../model/TilesLines";
import { TileLine } from "../../model/TileLine";
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

const createTileLine = (tiles: Tile[], boundaries?: IBoundaries): TileLine => {
    const line = new TileLine(
        boundaries || {
            left: 0,
            right: 100,
            top: 0,
            bottom: 100
        }
    );
    tiles.forEach(tile => line.addTile(tile));
    return line;
};

describe("Entities/EventLayout/model/DistribiutionFreeSpace", () => {
    let distribution: DistributionFreeSpace;
    let hiddenTilesManager: HiddenTilesManager;
    let tilesLines: TilesLines;
    const CONTAINER_WIDTH = 500;

    beforeEach(() => {
        hiddenTilesManager = new HiddenTilesManager();
        tilesLines = new TilesLines();
        distribution = new DistributionFreeSpace(hiddenTilesManager, CONTAINER_WIDTH);
    });

    describe("getRightBoundary", () => {
        it("It should return the maximum right border if the tile has no overlaps.", () => {
            const tile = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            const line = createTileLine([tile]);
            tilesLines.lines.set(line.boundaries, line);
            tile.lineKey = line.boundaries;

            const boundary: number = (distribution as any).getRightBoundary(tile, line);
            expect(boundary).toBe(100);
        });

        it("It should return the minimum left border from the right overlaps.", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 60, 25);
            const tile4 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const line = createTileLine([tile2], tile2.boundaries);
            tile2.overlaps = [tile1, tile3, tile4];
            tilesLines.lines.set(line.boundaries, line);
            tile2.lineKey = line.boundaries;

            const boundary: number = (distribution as any).getRightBoundary(tile2, line);
            expect(boundary).toBe(60);
        });

        it("Must handle the boundary cases correctly", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 50, 25);
            const tile4 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const line = createTileLine([tile2], tile2.boundaries);
            tile2.overlaps = [tile1, tile3, tile4];
            tilesLines.lines.set(line.boundaries, line);
            tile2.lineKey = line.boundaries;

            const boundary: number = (distribution as any).getRightBoundary(tile2, line);
            expect(boundary).toBe(50);
        });
    });

    describe("getLeftBoundary", () => {
        it("It should return the minimum left border if the tile has no overlaps.", () => {
            const tile = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            const line = createTileLine([tile]);
            tilesLines.lines.set(line.boundaries, line);
            tile.lineKey = line.boundaries;

            const boundary: number = (distribution as any).getLeftBoundary(tile, line);
            expect(boundary).toBe(0);
        });

        it("Should return the maximum right border from the right overlaps.", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 60, 25);
            const tile4 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const line = createTileLine([tile3], tile3.boundaries);
            tile3.overlaps = [tile1, tile2, tile4];
            tilesLines.lines.set(line.boundaries, line);
            tile3.lineKey = line.boundaries;

            const boundary: number = (distribution as any).getLeftBoundary(tile3, line);
            expect(boundary).toBe(50);
        });

        it("Must handle the boundary cases correctly", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 50, 25);
            const tile4 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const line = createTileLine([tile2], tile2.boundaries);
            tile2.overlaps = [tile1, tile3, tile4];
            tilesLines.lines.set(line.boundaries, line);
            tile3.lineKey = line.boundaries;

            const boundary: number = (distribution as any).getRightBoundary(tile2, line);
            expect(boundary).toBe(50);
        });
    });

    describe("fillEmptySpace", () => {
        it("It should fill the right free space, in case there are no neighbors at the last tile.", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const line = createTileLine([tile1, tile2]);
            line.boundaries.right = 50;
            tilesLines.lines.set(line.boundaries, line);
            tile1.lineKey = line.boundaries;
            tile2.lineKey = line.boundaries;

            tile1.next = [tile2];
            tile2.prev = [tile1];
            tile1.overlaps = [tile2];
            tile2.overlaps = [tile1];

            (distribution as any).fillEmptySpace(line);

            expect(line.boundaries).toEqual({ left: 0, right: 100, top: 0, bottom: 714 });
            // The borders of the tiles should be redistributed
            expect(tile1.boundaries).toEqual({ left: 0, right: 50, top: 680, bottom: 714 });
            expect(tile2.boundaries).toEqual({ left: 50, right: 100, top: 680, bottom: 714 });
        });

        it("It should fill the left free space, in case there are no neighbors at the first tile", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 50, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const line = createTileLine([tile1, tile2]);
            line.boundaries.left = 50;
            tilesLines.lines.set(line.boundaries, line);
            tile1.lineKey = line.boundaries;
            tile2.lineKey = line.boundaries;

            tile1.next = [tile2];
            tile2.prev = [tile1];
            tile1.overlaps = [tile2];
            tile2.overlaps = [tile1];

            (distribution as any).fillEmptySpace(line);
            // The line should stretch to the full available width
            expect(line.boundaries).toEqual({ left: 0, right: 100, top: 0, bottom: 714 });
            // The borders of the tiles should be redistributed
            expect(tile1.boundaries).toEqual({ left: 0, right: 50, top: 680, bottom: 714 });
            expect(tile2.boundaries).toEqual({ left: 50, right: 100, top: 680, bottom: 714 });
        });

        it("It should not fill the right free space if the last tile has neighbors", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 50, 25);
            const tile4 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 80, 20);
            const line = createTileLine([tile1, tile2]);
            line.boundaries.right = 50;
            tilesLines.lines.set(line.boundaries, line);
            tile1.lineKey = line.boundaries;
            tile2.lineKey = line.boundaries;

            tile1.next = [tile2];
            tile2.prev = [tile1];
            tile2.next = [tile3];
            tile1.overlaps = [tile2, tile3, tile4];
            tile2.overlaps = [tile1, tile3, tile4];
            tile3.overlaps = [tile1, tile2, tile4];
            tile4.overlaps = [tile1, tile2, tile3];

            (distribution as any).fillEmptySpace(line);
            // The line should not stretch
            expect(line.boundaries).toEqual({ left: 0, right: 50, top: 0, bottom: 714 });
            // The borders of the tiles should not be redistributed
            expect(tile1.boundaries).toEqual({ left: 0, right: 25, top: 680, bottom: 714 });
            expect(tile2.boundaries).toEqual({ left: 25, right: 50, top: 680, bottom: 714 });
        });

        it("It should not fill the left free space if the first tile has neighbors", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 50, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 50);
            const tile4 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 20);
            const line = createTileLine([tile1, tile2]);
            line.boundaries.left = 50;
            tilesLines.lines.set(line.boundaries, line);
            tile1.lineKey = line.boundaries;
            tile2.lineKey = line.boundaries;

            tile1.prev = [tile3];
            tile1.next = [tile2];
            tile2.prev = [tile1];
            tile1.overlaps = [tile2, tile3, tile4];
            tile2.overlaps = [tile1, tile3, tile4];
            tile3.overlaps = [tile1, tile2, tile4];
            tile4.overlaps = [tile1, tile2, tile3];

            (distribution as any).fillEmptySpace(line);
            // The line should not stretch to the full available width.
            expect(line.boundaries).toEqual({ left: 50, right: 100, top: 0, bottom: 714 });
            // The borders of the tiles should not be redistributed
            expect(tile1.boundaries).toEqual({ left: 50, right: 75, top: 680, bottom: 714 });
            expect(tile2.boundaries).toEqual({ left: 75, right: 100, top: 680, bottom: 714 });
        });

        it("Must fill the right free space, if there is a right overlap.", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 25, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 80, 20);
            const line = createTileLine([tile1, tile2]);
            line.boundaries.right = 50;
            tilesLines.lines.set(line.boundaries, line);
            tile1.lineKey = line.boundaries;
            tile2.lineKey = line.boundaries;

            tile1.next = [tile2];
            tile2.prev = [tile1];
            tile1.overlaps = [tile2, tile3];
            tile2.overlaps = [tile1, tile3];
            tile3.overlaps = [tile1, tile2];

            (distribution as any).fillEmptySpace(line);
            // The line should stretch
            expect(line.boundaries).toEqual({ left: 0, right: 80, top: 0, bottom: 714 });
            // The borders of the tiles should be redistributed
            expect(tile1.boundaries).toEqual({ left: 0, right: 40, top: 680, bottom: 714 });
            expect(tile2.boundaries).toEqual({ left: 40, right: 80, top: 680, bottom: 714 });
        });

        it("Must fill the left free space if there is a left overlap", () => {
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 50, 25);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 75, 25);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 0, 20);
            const line = createTileLine([tile1, tile2]);
            line.boundaries.left = 50;
            tilesLines.lines.set(line.boundaries, line);
            tile1.lineKey = line.boundaries;
            tile2.lineKey = line.boundaries;

            tile1.next = [tile2];
            tile2.prev = [tile1];
            tile1.overlaps = [tile2, tile3];
            tile2.overlaps = [tile1, tile3];
            tile3.overlaps = [tile1, tile2];

            (distribution as any).fillEmptySpace(line);
            // The line should not stretch to the full available width
            expect(line.boundaries).toEqual({ left: 20, right: 100, top: 0, bottom: 714 });
            // The borders of the tiles should not be redistributed
            expect(tile1.boundaries).toEqual({ left: 20, right: 60, top: 680, bottom: 714 });
            expect(tile2.boundaries).toEqual({ left: 60, right: 100, top: 680, bottom: 714 });
        });
    });
});
