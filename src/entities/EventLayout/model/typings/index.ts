import type { IEvent, IVerticalBoundaries, IHorizontalBoundaries, IBoundaries } from "@shared/typings";
import type { ILinkedOverlapEntity } from "./structures";

export interface IRow extends IVerticalBoundaries {
    tilesLines: ITilesLines;
}

export interface ITile extends IBoundaries, IEvent, ILinkedOverlapEntity<ITile> {
    height: number;
    width: number;
    overlaps: ITile[];
    lineKey: IBoundaries | null;
    hiddenKey: IVerticalBoundaries | null;
    get boundaries(): IBoundaries;
    /** Checking whether the tile is adjacent. */
    isNeighbour(neighbour: ITile, isNext: boolean): boolean;
    /** Filling connections with neighboring tiles based on overlaps. */
    fillNeighbours(): void;
}

export interface ITilesLines {
    lines: Map<IBoundaries, ITileLine>;
    /**
     * Adding tiles to a new line.
     * @param tile Adding tile.
     * @returns The key of the created line.
     */
    addLine(tile: ITile): IBoundaries;
    /**
     * Search for lines that overlap vertically with the tile.
     * @param tile The target tile.
     * @returns An array of overlapping lines.
     */
    tileVerticalOverlapsLines(tile: ITile): ITileLine[];
    /**
     * Redistribution of line tiles.
     * @param line A line for redistribution.
     */
    redistributeLineTiles(line: ITileLine): void;
}

export interface ITileLine {
    boundaries: IBoundaries;
    tiles: ITile[];
    /**
     * Adding the tile to the line.
     * @param tile The target tile.
     */
    addTile(tile: ITile): void;
    /**
     * Removing tile from the line.
     * @param tile The target tile.
     */
    removeTile(tile: ITile): void;
    /**
     * Updating the horizontal borders of the line.
     * @param boundaries New horizontal borders.
     */
    overwriteHorizontalBoundaries(boundaries: IHorizontalBoundaries): void;
}

export interface IHiddenTilesManager {
    get hiddenTilesMap(): Map<IVerticalBoundaries, ITile[]>;
    get hiddenTiles(): ITile[];
    get hiddenKeys(): IVerticalBoundaries[];
    /**
     * Checking for hidden tiles in the range.
     * @param keyOfLine The boundaries of the range being checked.
     */
    hasHiddenInRange(keyOfLine: IVerticalBoundaries): boolean;
    /**
     * Getting tiles by key.
     * @param key The key of the hidden tile area.
     */
    getTilesByKey(key: IVerticalBoundaries): ITile[];
    /**
     * Registration of the tile key.
     * @param tile The target tile.
     * @returns The key of the hidden tile area.
     */
    registerHiddenKey(tile: ITile): IVerticalBoundaries;
    /**
     * Adding the tile to the hidden collection.
     * @param tile The target tile.
     */
    addTile(tile: ITile): boolean;
    /**
     * Removing tile from the hidden collection.
     * @param tile The target tile.
     */
    removeTile(tile: ITile): boolean;
}

export interface IHiddenTilesCalculation {
    /**
     *Calculating hidden tiles.
     * @param containerWidth The width of the container in pixels.
     */
    calcHiddenTiles(containerWidth: number): void;
}

export type { IPlacementContext, IPlacementStrategy } from "./placementStrategies";
export type { ILinkedEntity, ILinkedOverlapEntity } from "./structures";
export type { IVerticalBoundaries, IHorizontalBoundaries, IBoundaries } from "@shared/typings";
