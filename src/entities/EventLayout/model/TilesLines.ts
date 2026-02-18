import { required, validate } from "@shared/lib";
import type { ITilesLines, ITileLine, IBoundaries, ITile } from "./typings";
import { BoundaryUtils } from "../lib";
import { TileLine } from "./TileLine";

export class TilesLines implements ITilesLines {
    public lines: Map<IBoundaries, ITileLine> = new Map();

    @validate
    public addLine(@required tile: ITile): IBoundaries {
        if (tile.lineKey && this.lines.has(tile.lineKey)) {
            return tile.lineKey;
        }
        const line: ITileLine = new TileLine(Object.assign({}, tile.boundaries));
        this.lines.set(line.boundaries, line);
        line.addTile(tile);
        return line.boundaries;
    }

    @validate
    public tileVerticalOverlapsLines(@required tile: ITile): ITileLine[] {
        const overlappingLines: ITileLine[] = [];
        for (const line of this.lines.values()) {
            if (BoundaryUtils.hasVerticalOverlap(line.boundaries, tile)) {
                overlappingLines.push(line);
            }
        }
        return overlappingLines;
    }

    @validate
    public redistributeLineTiles(@required line: ITileLine): void {
        let currentLineKey: IBoundaries | null = null;
        this.lines.delete(line.boundaries);
        for (let i = 0; i < line.tiles.length; ++i) {
            const tile: ITile = line.tiles[i]!;
            const isFirst: boolean = i === 0;
            const isLast: boolean = i === line.tiles.length - 1;
            if (isFirst || isLast) {
                if (this.handleOfBorderTiles(tile, isFirst)) {
                    continue;
                }
            }
            if (tile.next.length > 1 || tile.prev.length > 1) {
                currentLineKey = this.handleTileWithManyNeighbors(tile, currentLineKey);
                continue;
            }
            currentLineKey = this.handleRegularTile(tile, currentLineKey);
        }
    }

    private handleOfBorderTiles(tile: ITile, isFirst: boolean): boolean {
        if ((tile.next.length > 1 && isFirst) || (tile.prev.length > 1 && !isFirst)) {
            this.addLine(tile);
            return true;
        }
        return false;
    }

    private handleTileWithManyNeighbors(tile: ITile, currentLineKey: IBoundaries | null): IBoundaries | null {
        if (tile.next.length > 1) {
            if (currentLineKey) {
                BoundaryUtils.expandHorizontalBoundaries(currentLineKey, tile);
                this.addTileToCurrentLine(tile, currentLineKey);
                return null;
            }
            this.addLine(tile);
            return null;
        }
        if (tile.prev.length > 1) {
            return this.addLine(tile);
        }
        return null;
    }

    private handleRegularTile(tile: ITile, currentLineKey: IBoundaries | null): IBoundaries | null {
        if (!currentLineKey) {
            return this.addLine(tile);
        }
        BoundaryUtils.expandHorizontalBoundaries(currentLineKey, tile);
        this.addTileToCurrentLine(tile, currentLineKey);
        return currentLineKey;
    }

    private addTileToCurrentLine(tile: ITile, currentLineKey: IBoundaries): void {
        const currentLine: ITileLine | undefined = this.lines.get(currentLineKey);
        if (currentLine) {
            currentLine.addTile(tile);
        }
    }
}
