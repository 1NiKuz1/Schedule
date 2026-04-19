import type { IEvent } from "@shared/typings";
import { getElementAt } from "@/shared/lib";
import type {
    IVerticalBoundaries,
    IRow,
    ITile,
    ITilesLines,
    IPlacementStrategy,
    ITileLine,
    IHiddenTilesManager,
    IPlacementContext
} from "./typings";
import { BoundaryUtils, EventUtils, FloatComparator } from "../lib";
import { Tile } from "./Tile";
import { TilesLines } from "./TilesLines";
import { HiddenTilesManager } from "./HiddenTilesManager";
import { FreeSpacePlacementStrategy, WidestLinePlacementStrategy, PlacementContext } from "./placementStrategies";
import { HiddenTilesCalculation } from "./HiddenTilesCalculation";
import { DistributionFreeSpace } from "./DistributionFreeSpace";

export class EventLayoutModel {
    private _rows: IRow[] = [];
    private _hiddenTilesManager: IHiddenTilesManager;
    private _placementStrategies: IPlacementStrategy[] = [new FreeSpacePlacementStrategy(), new WidestLinePlacementStrategy()];
    private _events: IEvent[];
    private _containerWidth: number;

    constructor(events: IEvent[], containerWidth: number = 0) {
        this._events = events;
        this._containerWidth = containerWidth;
        this._hiddenTilesManager = new HiddenTilesManager();
        this.init();
    }

    public get hiddenTilesMap(): Map<IVerticalBoundaries, ITile[]> {
        return this._hiddenTilesManager.hiddenTilesMap;
    }

    public get lines() {
        const lines: ITileLine[] = [];
        for (const row of this._rows) {
            for (const line of row.tilesLines.lines.values()) {
                lines.push(line);
            }
        }
        return lines;
    }

    private init(): void {
        this._rows = this.buildRows(this._events);
        this.calcHiddenTiles();
        const distributionFreeSpace: DistributionFreeSpace = new DistributionFreeSpace(this._hiddenTilesManager, this._containerWidth);
        this.lines.forEach(line => distributionFreeSpace.fillEmptySpace(line));
    }

    private calcHiddenTiles(): void {
        this._rows.forEach(row => {
            const hiddenTilesCalculation: HiddenTilesCalculation = new HiddenTilesCalculation(this._hiddenTilesManager, row.tilesLines);
            hiddenTilesCalculation.calcHiddenTiles(this._containerWidth);
        });
    }

    private buildRows(events: IEvent[]): IRow[] {
        const rows: IRow[] = [];
        const rowEndTimes: number[] = [];

        for (const event of events) {
            const tile = this.createTile(event);
            let rowIndex = -1;
            // Search for the first matching line
            for (let i = rowEndTimes.length - 1; i >= 0; i--) {
                if (FloatComparator.less(tile.top, getElementAt(rowEndTimes, i))) {
                    if (BoundaryUtils.hasVerticalOverlap(getElementAt(rows, i), tile)) {
                        rowIndex = i;
                        break;
                    }
                    continue;
                }
                break;
            }
            if (rowIndex >= 0) {
                this.addTileToRow(getElementAt(rows, rowIndex), tile);
                // Updating the end time of the line
                rowEndTimes[rowIndex] = Math.max(getElementAt(rowEndTimes, rowIndex), tile.bottom);
                continue;
            }
            const newRow = this.createRow(tile);
            rows.push(newRow);
            rowEndTimes.push(tile.bottom);
        }
        return rows;
    }

    private createRow(tile: ITile): IRow {
        const boundaries: IVerticalBoundaries = { top: tile.top, bottom: tile.bottom };
        const tilesLines: ITilesLines = new TilesLines();
        tilesLines.addLine(tile);
        return { ...boundaries, tilesLines: tilesLines };
    }

    private createTile(event: IEvent): ITile {
        const tile: ITile = new Tile(event);
        tile.height = EventUtils.calcEventHeight(event);
        tile.description = EventUtils.getEventDescription(event);
        this._hiddenTilesManager.registerHiddenKey(tile);
        return tile;
    }

    private addTileToRow(row: IRow, tile: ITile): void {
        const verticalOverlapsLines: ITileLine[] = row.tilesLines.tileVerticalOverlapsLines(tile);
        this.fillTileOverlaps(verticalOverlapsLines, tile);
        const context: IPlacementContext = new PlacementContext(
            this._containerWidth,
            row.tilesLines,
            this._hiddenTilesManager,
            verticalOverlapsLines
        );
        for (const strategy of this._placementStrategies) {
            if (strategy.place(tile, context)) {
                BoundaryUtils.expandVerticalBoundaries(row, tile);
                return;
            }
        }
        this.addHiddenTile(tile);
    }

    private fillTileOverlaps(lines: ITileLine[], tile: ITile): void {
        lines.forEach(line => line.tiles.forEach(t => t.addOverlap(tile)));
    }

    private addHiddenTile(tile: ITile): void {
        tile.deleteAllOverlaps();
        this._hiddenTilesManager.addTile(tile);
    }
}
