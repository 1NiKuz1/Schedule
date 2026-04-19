import { Sizes } from "@shared/config";
import { FloatComparator, BoundaryUtils, ButtonWidthCalculator } from "../lib";
import type { IHiddenTilesManager, ITile, ITileLine } from "./typings";

export class DistributionFreeSpace {
    private readonly _hiddenTilesManager: IHiddenTilesManager;
    private _buttonWidthPercent: number = 0;

    constructor(hiddenTilesManager: IHiddenTilesManager, containerWidth: number) {
        this._hiddenTilesManager = hiddenTilesManager;
        this._buttonWidthPercent = ButtonWidthCalculator.calculate(containerWidth);
    }

    public fillEmptySpace(line: ITileLine): void {
        if (!line.tiles.length) {
            return;
        }
        const lastTile: ITile = line.tiles[line.tiles.length - 1]!;
        const firstTile: ITile = line.tiles[0]!;
        let rightBoundary: number = this.getRightBoundary(lastTile, line);
        const leftBoundary: number = this.getLeftBoundary(firstTile, line);
        if (!FloatComparator.equal(rightBoundary, line.boundaries.right) && this._hiddenTilesManager.hasHiddenInRange(line.boundaries)) {
            rightBoundary = Sizes.MAX_PERCENT_WIDTH - this._buttonWidthPercent;
        }
        const isRightDistribute: boolean = !lastTile.next.length && FloatComparator.greater(rightBoundary, line.boundaries.right);
        const isLeftDistribute: boolean = !firstTile.prev.length && FloatComparator.greater(line.boundaries.left, leftBoundary);
        if (isRightDistribute) {
            line.boundaries.right = rightBoundary;
        }
        if (isLeftDistribute) {
            line.boundaries.left = leftBoundary;
        }
        if (isRightDistribute || isLeftDistribute) {
            BoundaryUtils.distributeTilesUniformly(line.tiles, line.boundaries);
        }
    }

    private getRightBoundary(tile: ITile, line: ITileLine): number {
        let max: number = 100;
        if (!tile.overlaps.length) {
            return max;
        }
        for (const overlap of tile.overlaps) {
            if (FloatComparator.greater(line.boundaries.right, overlap.left)) {
                continue;
            }
            if (!FloatComparator.greater(overlap.left, max)) {
                max = overlap.left;
            }
        }
        return max;
    }

    private getLeftBoundary(tile: ITile, line: ITileLine): number {
        let min: number = 0;
        if (!tile.overlaps.length) {
            return min;
        }
        for (const overlap of tile.overlaps) {
            if (FloatComparator.greater(overlap.right, line.boundaries.left)) {
                continue;
            }
            if (!FloatComparator.greater(min, overlap.right)) {
                min = overlap.right;
            }
        }
        return min;
    }
}
