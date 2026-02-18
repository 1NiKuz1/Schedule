import { describe, it, expect, beforeEach, vi } from "vitest";
import { IEvent, IBoundaries } from "@shared/typings";
import { WidestLinePlacementStrategy, PlacementContext } from "../../../model/placementStrategies";
import { TilesLines } from "../../../model/TilesLines";
import { HiddenTilesManager } from "../../../model/HiddenTilesManager";
import { TileLine } from "../../../model/TileLine";
import { Tile } from "../../../model/Tile";
import { BoundaryUtils } from "../../../lib";

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

describe("Entities/EventLayout/model/placementStrategies/WidestLinePlacementStrategy", () => {
    let strategy: WidestLinePlacementStrategy;
    let context: PlacementContext;
    let tilesLines: TilesLines;
    let hiddenTilesManager: HiddenTilesManager;
    let verticalOverlapsLines: TileLine[];

    beforeEach(() => {
        strategy = new WidestLinePlacementStrategy();
        tilesLines = new TilesLines();
        hiddenTilesManager = new HiddenTilesManager();
        verticalOverlapsLines = [];
        context = new PlacementContext(500, tilesLines, hiddenTilesManager, verticalOverlapsLines);
    });

    it("Must successfully place the tile in the widest line", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"));
        const line1 = createTileLine([tile1], { left: 0, right: 60, top: 0, bottom: 100 });

        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"));
        const line2 = createTileLine([tile2], { left: 0, right: 100, top: 0, bottom: 100 });

        tilesLines.lines.set(line1.boundaries, line1);
        tilesLines.lines.set(line2.boundaries, line2);

        verticalOverlapsLines.push(line1, line2);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps.push(newTile);
        tile2.overlaps.push(newTile);

        const result = strategy.place(newTile, context);

        expect(result).toBe(true);
        expect(line2.tiles).toContain(newTile); // It should be added to the widest line
        expect(newTile.lineKey).toEqual(line2.boundaries);
    });

    it("Must reallocate the space to accommodate the tiles", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 50);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 50, 50);
        const line = createTileLine([tile1, tile2]);

        tilesLines.lines.set(line.boundaries, line);
        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps.push(newTile);
        tile2.overlaps.push(newTile);

        const distributeSpy = vi.spyOn(BoundaryUtils, "distributeTilesUniformly");

        const result = strategy.place(newTile, context);

        expect(result).toBe(true);
        expect(distributeSpy).toHaveBeenCalled();
        expect(line.tiles).toContain(newTile);
    });

    it("Must choose the line with the most effective space", () => {
        const line1 = createTileLine(
            [
                createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 20),
                createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 20, 20),
                createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 40, 20)
            ],
            { left: 0, right: 100, top: 0, bottom: 100 }
        );

        const line2 = createTileLine([createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 40)], {
            left: 0,
            right: 80,
            top: 0,
            bottom: 100
        });

        tilesLines.lines.set(line1.boundaries, line1);
        tilesLines.lines.set(line2.boundaries, line2);
        verticalOverlapsLines.push(line1, line2);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [...line1.tiles, ...line2.tiles];
        line1.tiles.forEach(t => t.overlaps.push(newTile));
        line2.tiles.forEach(t => t.overlaps.push(newTile));

        const result = strategy.place(newTile, context);

        expect(result).toBe(true);
        // Line2 should be selected as having more free space per tile
        expect(line2.tiles).toContain(newTile);
    });

    it("Must fill in the neighbors' connections after placement", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 50);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 50, 50);
        const line = createTileLine([tile1, tile2]);

        tilesLines.lines.set(line.boundaries, line);
        verticalOverlapsLines.push(line);

        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));
        newTile.overlaps = [tile1, tile2];
        tile1.overlaps.push(newTile);
        tile2.overlaps.push(newTile);

        const fillNeighboursSpy = vi.spyOn(newTile, "fillNeighbours");

        strategy.place(newTile, context);

        expect(fillNeighboursSpy).toHaveBeenCalled();
    });

    it("Should handle the case without overlapping lines", () => {
        const newTile = createTile(new Date("2023-10-01T10:30"), new Date("2023-10-01T11:30"));

        const result = strategy.place(newTile, context);

        expect(result).toBe(false);
    });

    it("Should not add a tile if its width is less than the minimum", () => {
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 94, 3);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 97, 3);
        const line = createTileLine([tile1], { left: 94, right: 100, top: 0, bottom: 100 });
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
        const tile1 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 0, 50);
        const tile2 = createTile(new Date("2023-10-01T10:00"), new Date("2023-10-01T11:00"), 50, 100);
        const line = createTileLine([tile1], { left: 0, right: 100, top: 0, bottom: 100 });
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
