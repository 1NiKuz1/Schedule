import { describe, it, expect, beforeEach } from "vitest";
import { IEvent } from "@shared/typings";
import { TilesLines } from "../../model/TilesLines";
import { Tile } from "../../model/Tile";
import { ITileLine } from "../../model/typings";

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

describe("Entities/EventLayout/model/TilesLines", () => {
    let tilesLines: TilesLines;
    let tileA: Tile;
    let tileB: Tile;
    let tileC: Tile;
    let tileD: Tile;

    beforeEach(() => {
        tilesLines = new TilesLines();

        tileA = createTile(new Date("2023-10-01T01:00"), new Date("2023-10-01T02:00"));
        tileB = createTile(new Date("2023-10-01T01:00"), new Date("2023-10-01T02:00"));
        tileC = createTile(new Date("2023-10-01T01:30"), new Date("2023-10-01T02:30"));
        tileD = createTile(new Date("2023-10-01T00:30"), new Date("2023-10-01T01:30"));
    });

    describe("addLine", () => {
        it("Must create a new line for the tile", () => {
            const key = tilesLines.addLine(tileA);

            expect(tilesLines.lines.size).toBe(1);
            expect(tilesLines.lines.has(key)).toBe(true);

            const line = tilesLines.lines.get(key);
            expect(line.tiles).toContain(tileA);
            expect(tileA.lineKey).toEqual(key);
        });

        it("Should not create duplicate lines for a single tile", () => {
            const key1 = tilesLines.addLine(tileA);
            const key2 = tilesLines.addLine(tileA);

            expect(tilesLines.lines.size).toBe(1);
            expect(key1).toEqual(key2);
        });
    });

    describe("tileVerticalOverlapsLines", () => {
        it("Must find lines that overlap vertically with the tile.", () => {
            tilesLines.addLine(tileA);
            tilesLines.addLine(tileC);

            const searchTile = createTile(new Date("2023-10-01T01:30"), new Date("2023-10-01T01:50"));

            const overlappingLines = tilesLines.tileVerticalOverlapsLines(searchTile);
            expect(overlappingLines).toHaveLength(2);
        });

        it("It should not find lines without vertical overlap.", () => {
            tilesLines.addLine(tileA);

            const searchTile = createTile(new Date("2023-10-01T03:00"), new Date("2023-10-01T04:00"));

            const overlappingLines = tilesLines.tileVerticalOverlapsLines(searchTile);
            expect(overlappingLines).toHaveLength(0);
        });

        it("Must take into account the boundary conditions", () => {
            tilesLines.addLine(tileA);

            const edgeTile = createTile(new Date("2023-10-01T02:00"), new Date("2023-10-01T03:00"));

            const overlappingLines = tilesLines.tileVerticalOverlapsLines(edgeTile);
            expect(overlappingLines).toHaveLength(0);
        });
    });

    describe("redistributeLineTiles", () => {
        let line: ITileLine;
        let lineKey: any;

        beforeEach(() => {
            lineKey = tilesLines.addLine(tileA);
            line = tilesLines.lines.get(lineKey);

            line.addTile(tileB);
            line.addTile(tileC);
            tileA.next = [tileB];
            tileB.prev = [tileA];
            tileB.next = [tileC];
            tileC.prev = [tileB];
        });

        it("Must delete the original line after reallocation", () => {
            tilesLines.redistributeLineTiles(line);
            expect(tilesLines.lines.has(lineKey)).toBe(false);
        });

        it("Must keep consecutive tiles in the same line", () => {
            tilesLines.redistributeLineTiles(line);

            expect(tilesLines.lines.size).toBe(1);
            expect(tilesLines.lines.has(lineKey)).toBe(false);

            const newLine = tilesLines.lines.values().next().value;
            expect(newLine.tiles).toEqual([tileA, tileB, tileC]);
        });

        it("Must create new lines for tiles with multiple neighbors", () => {
            tileB.prev = [tileA, tileD];
            tileD.next = [tileB];
            tilesLines.redistributeLineTiles(line);

            expect(tilesLines.lines.size).toBe(2);
        });

        it("Must maintain connections between tiles when redistributing", () => {
            tileA.next = [tileB];
            tileB.prev = [tileA];

            const lineKey = tilesLines.addLine(tileA);
            const line = tilesLines.lines.get(lineKey);
            line.addTile(tileB);

            tilesLines.redistributeLineTiles(line);

            expect(tileA.next).toContain(tileB);
            expect(tileB.prev).toContain(tileA);
        });
    });

    describe("Complex scenarios", () => {
        it("Must correctly handle a line with one tile", () => {
            const key = tilesLines.addLine(tileA);
            const line = tilesLines.lines.get(key);

            tilesLines.redistributeLineTiles(line);

            expect(tilesLines.lines.size).toBe(1);
            expect(tilesLines.lines.has(key)).toBe(false);
            expect(tileA.lineKey).not.toBe(key);
        });

        it("Must handle an empty line correctly", () => {
            const key = tilesLines.addLine(tileA);
            const line = tilesLines.lines.get(key);
            line.removeTile(tileA);

            tilesLines.redistributeLineTiles(line);

            expect(tilesLines.lines.has(key)).toBe(false);
        });
    });
});
