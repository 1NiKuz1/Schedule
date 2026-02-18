import { describe, it, expect, beforeEach, vi } from "vitest";
import { IEvent, IBoundaries } from "@shared/typings";
import { FreeSpacePlacementStrategy, PlacementContext } from "../../../model/placementStrategies";
import { TilesLines } from "../../../model/TilesLines";
import { HiddenTilesManager } from "../../../model/HiddenTilesManager";
import { TileLine } from "../../../model/TileLine";
import { Tile } from "../../../model/Tile";

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

const createTileLine = (tiles: Tile[] = [], boundaries?: IBoundaries): TileLine => {
    const line = new TileLine(
        boundaries || {
            left: 0,
            right: 100,
            top: 0,
            bottom: 100
        }
    );

    tiles.forEach(tile => {
        line.addTile(tile);
        tile.lineKey = line.boundaries;
    });
    return line;
};

describe("Entities/EventLayout/model/placementStrategies/FreeSpacePlacementStrategy", () => {
    let strategy: FreeSpacePlacementStrategy;
    let context: PlacementContext;
    let tilesLines: TilesLines;
    let hiddenTilesManager: HiddenTilesManager;
    let verticalOverlapsLines: TileLine[];

    beforeEach(() => {
        strategy = new FreeSpacePlacementStrategy();
        tilesLines = new TilesLines();
        hiddenTilesManager = new HiddenTilesManager();
        verticalOverlapsLines = [];
        context = new PlacementContext(500, tilesLines, hiddenTilesManager, verticalOverlapsLines);
    });

    it("Must successfully place the tile in the free space", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T12:00"), 0, 50);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 50, 100);

        const line = createTileLine([tile1, tile2]);
        tilesLines.lines.set(line.boundaries, line);

        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T11:00"), new Date("2023-10-01T12:00"));
        newTile.overlaps = [tile1];
        tile1.overlaps = [newTile];

        const result = strategy.place(newTile, context);

        expect(result).toBe(true);
        expect(newTile.left).toBe(50);
        expect(newTile.width).toBe(50);
        expect(tilesLines.lines.size).toBe(2); // A new line must be created
    });

    it("Should return false if there is no free space", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 50);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 50, 100);

        const line = createTileLine([tile1, tile2]);
        tilesLines.lines.set(line.boundaries, line);
        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps = [newTile, tile2];
        tile2.overlaps = [newTile, tile1];

        const result = strategy.place(newTile, context);

        expect(result).toBe(false); // The new tile should not be placed
    });

    it("Must redistribute tiles in the affected line", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 30);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 70, 30);
        const line = createTileLine([tile1, tile2]);
        tilesLines.lines.set(line.boundaries, line);
        verticalOverlapsLines.push(line);

        const redistributeSpy = vi.spyOn(tilesLines, "redistributeLineTiles");

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps = [newTile, tile2];
        tile2.overlaps = [newTile, tile1];

        strategy.place(newTile, context);

        expect(redistributeSpy).toHaveBeenCalledWith(line);
    });

    it("Must fill in the neighbor connections for the new tile", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 30);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 70, 30);
        const line = createTileLine([tile1, tile2]);
        tilesLines.lines.set(line.boundaries, line);
        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps = [newTile, tile2];
        tile2.overlaps = [newTile, tile1];
        const fillNeighboursSpy = vi.spyOn(newTile, "fillNeighbours");

        strategy.place(newTile, context);

        expect(fillNeighboursSpy).toHaveBeenCalled();
    });

    it("Must create a new line for the placed tile", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 30);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 70, 30);
        const line = createTileLine([tile1, tile2]);
        tilesLines.lines.set(line.boundaries, line);
        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps = [newTile, tile2];
        tile2.overlaps = [newTile, tile1];

        strategy.place(newTile, context);

        // We check that a new line has been created and contains a tile.
        const newLine = Array.from(tilesLines.lines.values()).find(l => l.tiles.includes(newTile));
        expect(newLine).toBeDefined();
    });

    it("Must correctly handle the case when there are no overlapping lines.", () => {
        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));

        const result = strategy.place(newTile, context);

        expect(result).toBe(true); // It should still fit
        expect(newTile.left).toBe(0);
        expect(newTile.width).toBe(100);
    });

    it("I should not add a tile if its width is less than the minimum", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 50);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 50, 48);
        const line = createTileLine([tile1], { left: 0, right: 98, top: 0, bottom: 100 });
        tilesLines.lines.set(line.boundaries, line);

        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps.push(newTile);
        tile2.overlaps.push(newTile);

        const result = strategy.place(newTile, context);

        expect(result).toBe(false);
        expect(line.tiles).not.toContain(newTile);
        expect(newTile.lineKey).toBe(null);
    });

    it("Must not add a tile if its lower boundary is greater than the maximum allowed value", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 25);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 25, 25);
        const line = createTileLine([tile1], { left: 0, right: 50, top: 0, bottom: 100 });
        tilesLines.lines.set(line.boundaries, line);

        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T23:30"), new Date("2023-10-02T01:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps.push(newTile);
        tile2.overlaps.push(newTile);

        const result = strategy.place(newTile, context);

        expect(result).toBe(false);
        expect(line.tiles).not.toContain(newTile);
        expect(newTile.lineKey).toBe(null);
    });
});
