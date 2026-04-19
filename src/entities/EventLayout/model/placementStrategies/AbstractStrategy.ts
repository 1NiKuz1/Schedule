import type { IPlacementStrategy, IPlacementContext, ITile, IHorizontalBoundaries } from "../typings";
import { Sizes } from "@shared/config";

export abstract class AbstractStrategy implements IPlacementStrategy {
    protected context: IPlacementContext | null = null;

    public place(tile: ITile, context: IPlacementContext): boolean {
        this.context = context;
        return true;
    }

    protected get safeContext(): IPlacementContext {
        if (!this.context) {
            throw new Error("Context has not been initialized");
        }
        return this.context;
    }

    protected isTilePlacementValid(tile: ITile, boundaries: IHorizontalBoundaries, containerWidth: number) {
        const { minRequiredWidth, isLowPosition } = this.calculatePlacementFactors(tile, boundaries, containerWidth);
        return minRequiredWidth && !isLowPosition;
    }

    private calculatePlacementFactors(tile: ITile, boundaries: IHorizontalBoundaries, containerWidth: number) {
        const tileWidth = boundaries.right - boundaries.left;
        const tileWidthPx = this.convertToPixels(tileWidth, containerWidth);

        return {
            minRequiredWidth: tileWidthPx >= this.getMinTileWidth(tile),
            isLowPosition: this.isTooLowForPlacement(tile)
        };
    }

    private convertToPixels(widthPercent: number, containerWidth: number): number {
        return (widthPercent / Sizes.MAX_PERCENT_WIDTH) * containerWidth - Sizes.INDENT_SCHEDULE_BLOCK;
    }

    private getMinTileWidth(tile: ITile): number {
        const baseWidth = Sizes.MIN_WIDTH_SCHEDULE_BLOCK;
        return tile.height < Sizes.MIN_HEIGHT_SCHEDULE_BLOCK ? baseWidth + Sizes.WIDTH_SCHEDULE_BLOCK_EXTENSION : baseWidth;
    }

    private isTooLowForPlacement(tile: ITile): boolean {
        return Sizes.HEIGHT_OF_TEMPLATE - tile.top <= Sizes.MIN_HEIGHT_SCHEDULE_BLOCK + Sizes.INDENT_SCHEDULE_BLOCK;
    }
}
