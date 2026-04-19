import { Sizes } from "@shared/config";
import { getElementAt } from "@/shared/lib";
import { BoundaryUtils, ButtonWidthCalculator, FloatComparator } from "../lib";
import type { IHiddenTilesCalculation, IHiddenTilesManager, IHorizontalBoundaries, ITile, ITileLine, ITilesLines } from "./typings";

export class HiddenTilesCalculation implements IHiddenTilesCalculation {
    private readonly _tilesLines: ITilesLines;
    private readonly _hiddenTilesManager: IHiddenTilesManager;
    private _buttonWidthPercent: number = 0;

    constructor(hiddenTiles: IHiddenTilesManager, tilesLines: ITilesLines) {
        this._hiddenTilesManager = hiddenTiles;
        this._tilesLines = tilesLines;
    }

    public calcHiddenTiles(containerWidth: number): void {
        this.prepareButtonWidth(containerWidth);
        this.processEdgeLines(containerWidth);
    }

    private prepareButtonWidth(containerWidth: number): void {
        this._buttonWidthPercent = ButtonWidthCalculator.calculate(containerWidth);
    }

    private processEdgeLines(containerWidth: number): void {
        const edgeLines: ITileLine[] = this.getEdgeLines();
        for (const line of edgeLines) {
            line.boundaries.right = line.boundaries.right - this._buttonWidthPercent;
            BoundaryUtils.distributeTilesUniformly(line.tiles, line.boundaries);
            this.hideSmallTiles(line.boundaries, line, containerWidth);
            if (!line.tiles.length) {
                this._tilesLines.lines.delete(line.boundaries);
            }
            return this.processEdgeLines(containerWidth);
        }
    }

    private getEdgeLines(): ITileLine[] {
        const edgeLines: ITileLine[] = [];
        for (const line of this._tilesLines.lines.values()) {
            if (FloatComparator.greater(line.boundaries.right, Sizes.MAX_PERCENT_WIDTH - this._buttonWidthPercent)) {
                if (this._hiddenTilesManager.hasHiddenInRange(line.boundaries)) {
                    edgeLines.push(line);
                }
            }
        }
        return edgeLines;
    }

    private hideSmallTiles(boundaries: IHorizontalBoundaries, line: ITileLine, containerWidth: number): void {
        const minWidth: number = Sizes.MIN_WIDTH_SCHEDULE_BLOCK;
        const minWidthExtended: number = minWidth + Sizes.WIDTH_SCHEDULE_BLOCK_EXTENSION;
        const lineWidth: number = boundaries.right - boundaries.left;
        for (let i = line.tiles.length - 1; i >= 0; --i) {
            const tile: ITile = line.tiles[i]!;
            const tileWidthPx: number =
                (lineWidth / line.tiles.length / Sizes.MAX_PERCENT_WIDTH) * containerWidth - Sizes.INDENT_SCHEDULE_BLOCK;
            const minTileWidth: number = tile.height < Sizes.MIN_HEIGHT_SCHEDULE_BLOCK ? minWidthExtended : minWidth;
            if (tileWidthPx < minTileWidth || Sizes.HEIGHT_OF_TEMPLATE - tile.top < Sizes.MIN_HEIGHT_SCHEDULE_BLOCK) {
                const lastTile: ITile = getElementAt(line.tiles, line.tiles.length - 1);
                line.removeTile(lastTile);
                this._hiddenTilesManager.addTile(lastTile);
                BoundaryUtils.distributeTilesUniformly(line.tiles, boundaries);
                continue;
            }
            return;
        }
    }
}
