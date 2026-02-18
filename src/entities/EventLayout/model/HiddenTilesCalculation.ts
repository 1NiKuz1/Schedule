import { Sizes } from "@shared/config";
import { BoundaryUtils, ButtonWidthCalculator, FloatComparator } from "../lib";
import type { IHiddenTilesCalculation, IHiddenTilesManager, IHorizontalBoundaries, ITile, ITileLine, ITilesLines } from "./typings";

export class HiddenTilesCalculation implements IHiddenTilesCalculation {
    private readonly tilesLines: ITilesLines;
    private readonly hiddenTilesManager: IHiddenTilesManager;
    private buttonWidthPercent: number = 0;

    constructor(hiddenTiles: IHiddenTilesManager, tilesLines: ITilesLines) {
        this.hiddenTilesManager = hiddenTiles;
        this.tilesLines = tilesLines;
    }

    public calcHiddenTiles(containerWidth: number): void {
        this.prepareButtonWidth(containerWidth);
        this.processEdgeLines(containerWidth);
    }

    private prepareButtonWidth(containerWidth: number): void {
        this.buttonWidthPercent = ButtonWidthCalculator.calculate(containerWidth);
    }

    private processEdgeLines(containerWidth: number): void {
        const edgeLines: ITileLine[] = this.getEdgeLines();
        for (const line of edgeLines) {
            line.boundaries.right = line.boundaries.right - this.buttonWidthPercent;
            BoundaryUtils.distributeTilesUniformly(line.tiles, line.boundaries);
            this.hideSmallTiles(line.boundaries, line, containerWidth);
            if (!line.tiles.length) {
                this.tilesLines.lines.delete(line.boundaries);
            }
            return this.processEdgeLines(containerWidth);
        }
    }

    private getEdgeLines(): ITileLine[] {
        const edgeLines: ITileLine[] = [];
        for (const line of this.tilesLines.lines.values()) {
            if (FloatComparator.greater(line.boundaries.right, Sizes.MAX_PERCENT_WIDTH - this.buttonWidthPercent)) {
                if (this.hiddenTilesManager.hasHiddenInRange(line.boundaries)) {
                    edgeLines.push(line);
                }
            }
        }
        return edgeLines;
    }

    private hideSmallTiles(boudaries: IHorizontalBoundaries, line: ITileLine, containerWidth: number): void {
        const minWidth: number = Sizes.MIN_WIDTH_SCHEDULE_BLOCK;
        const minWidthExtended: number = minWidth + Sizes.WIDTH_SCHEDULE_BLOCK_EXTENSION;
        const lineWidth: number = boudaries.right - boudaries.left;
        for (let i = line.tiles.length - 1; i >= 0; --i) {
            const tile: ITile = line.tiles[i]!;
            const tileWidthPx: number =
                (lineWidth / line.tiles.length / Sizes.MAX_PERCENT_WIDTH) * containerWidth - Sizes.INDENT_SCHEDULE_BLOCK;
            const minTileWidth: number = tile.height < Sizes.MIN_HEIGHT_SCHEDULE_BLOCK ? minWidthExtended : minWidth;
            if (tileWidthPx < minTileWidth || Sizes.HEIGHT_OF_TEMPLATE - tile.top < Sizes.MIN_HEIGHT_SCHEDULE_BLOCK) {
                const lastTile: ITile = line.tiles[line.tiles.length - 1]!;
                line.removeTile(lastTile);
                this.hiddenTilesManager.addTile(lastTile);
                BoundaryUtils.distributeTilesUniformly(line.tiles, boudaries);
                continue;
            }
            return;
        }
    }
}
