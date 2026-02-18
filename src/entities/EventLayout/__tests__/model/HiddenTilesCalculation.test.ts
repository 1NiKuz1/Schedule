import { describe, it, expect, beforeEach, vi } from "vitest";
import { IEvent, IBoundaries } from "@shared/typings";
import { HiddenTilesCalculation } from "../../model/HiddenTilesCalculation";
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

describe("Entities/EventLayout/model/HiddenTilesCalculation", () => {
    let calculation: HiddenTilesCalculation;
    let hiddenTilesManager: HiddenTilesManager;
    let tilesLines: TilesLines;
    const CONTAINER_WIDTH = 500;

    beforeEach(() => {
        hiddenTilesManager = new HiddenTilesManager();
        tilesLines = new TilesLines();
        calculation = new HiddenTilesCalculation(hiddenTilesManager, tilesLines);
    });

    describe("calcHiddenTiles", () => {
        it("Must hide tiles that are too narrow.", () => {
            const tile = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 99, 1);
            const line = createTileLine([tile], tile.boundaries);
            tilesLines.lines.set(line.boundaries, line);
            tile.lineKey = line.boundaries;
            hiddenTilesManager.registerHiddenKey(tile);

            vi.spyOn(hiddenTilesManager, "hasHiddenInRange").mockReturnValue(true);

            calculation.calcHiddenTiles(CONTAINER_WIDTH);

            expect(line.tiles).not.toContain(tile);
            // Since the line no longer contains tiles, it is deleted.
            expect(tilesLines.lines.size).toBe(0);
            expect(hiddenTilesManager.hiddenTiles).toContain(tile);
        });

        it("Must handle multiple lines correctly", () => {
            const tile1 = createTile(new Date("2023-10-01T10:50"), new Date("2023-10-01T11:15"));
            const line1 = createTileLine([tile1], tile1.boundaries);
            tilesLines.lines.set(line1.boundaries, line1);
            tile1.lineKey = line1.boundaries;
            hiddenTilesManager.registerHiddenKey(tile1);

            const tile2 = createTile(new Date("2023-10-01T11:50"), new Date("2023-10-01T12:15"));
            const line2 = createTileLine([tile2], tile2.boundaries);
            tilesLines.lines.set(line2.boundaries, line2);
            tile2.lineKey = line2.boundaries;
            hiddenTilesManager.registerHiddenKey(tile2);

            calculation.calcHiddenTiles(CONTAINER_WIDTH);
            // We check that all tiles remain visible
            expect(line1.tiles.length).toBe(1);
            expect(line2.tiles.length).toBe(1);
            expect(hiddenTilesManager.hiddenTiles.length).toBe(0);
        });
    });

    describe("getEdgeLines", () => {
        it("It should return the lines that need to be compressed", () => {
            const hiddenTile = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            hiddenTilesManager.registerHiddenKey(hiddenTile);
            hiddenTilesManager.addTile(hiddenTile);
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            const line1 = createTileLine([tile1]);
            tilesLines.lines.set(line1.boundaries, line1);
            tile1.lineKey = line1.boundaries;
            hiddenTilesManager.registerHiddenKey(tile1);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            const line2 = createTileLine([tile2], { ...tile2.boundaries, left: 0, right: 50 });
            tilesLines.lines.set(line2.boundaries, line2);
            tile2.lineKey = line2.boundaries;
            hiddenTilesManager.registerHiddenKey(tile2);

            (calculation as any).prepareButtonWidth(CONTAINER_WIDTH);

            const lines = (calculation as any).getEdgeLines(CONTAINER_WIDTH);

            expect(lines.length).toBe(1);
            expect(lines.includes(line1)).toBe(true);
        });
    });

    describe("processEdgeLines", () => {
        it("Must handle the boundary lines correctly", () => {
            const hiddenTile = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            hiddenTilesManager.registerHiddenKey(hiddenTile);
            hiddenTilesManager.addTile(hiddenTile);
            const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            const line1 = createTileLine([tile1]);
            tilesLines.lines.set(line1.boundaries, line1);
            tile1.lineKey = line1.boundaries;
            hiddenTilesManager.registerHiddenKey(tile1);
            const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"));
            const line2 = createTileLine([tile2], { left: 0, right: 50, top: 0, bottom: 714 });
            tilesLines.lines.set(line2.boundaries, line2);
            tile2.lineKey = line2.boundaries;
            hiddenTilesManager.registerHiddenKey(tile2);
            const tile3 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 99, 1);
            const line3 = createTileLine([tile3], { left: 99, right: 100, top: 0, bottom: 714 });
            tilesLines.lines.set(line3.boundaries, line3);
            tile3.lineKey = line3.boundaries;
            hiddenTilesManager.registerHiddenKey(tile3);

            (calculation as any).prepareButtonWidth(CONTAINER_WIDTH);

            (calculation as any).processEdgeLines(CONTAINER_WIDTH);
            // The right border of the line should be updated.
            expect(line1.boundaries).toEqual({ left: 0, right: 94, top: 0, bottom: 714 });
            expect(line1.tiles.length).toBe(1);
            // The line should not change
            expect(line2.boundaries).toEqual({ left: 0, right: 50, top: 0, bottom: 714 });
            expect(line2.tiles.length).toBe(1);
            // Since the line no longer contains tiles, it is deleted.
            expect(tilesLines.lines.size).toBe(2);
            expect(hiddenTilesManager.hiddenTiles).toContain(tile3);
        });
    });

    describe("hideSmallTiles", () => {
        it("Must properly hide the tiles in the line", () => {
            const tile = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T10:30"), 99, 1);
            const line = createTileLine([tile], { left: 99, right: 100, top: 0, bottom: 714 });
            tilesLines.lines.set(line.boundaries, line);
            tile.lineKey = line.boundaries;
            hiddenTilesManager.registerHiddenKey(tile);

            (calculation as any).prepareButtonWidth(CONTAINER_WIDTH);

            (calculation as any).hideSmallTiles(line.boundaries, line, CONTAINER_WIDTH);
            expect(line.tiles.length).toBe(0);
            expect(hiddenTilesManager.hiddenTiles).toContain(tile);
        });
    });
});
