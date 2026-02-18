import type { ITilesLines, IHiddenTilesManager, ITile, ITileLine } from ".";

export interface IPlacementContext {
    readonly containerWidth: number;
    readonly tilesLines: ITilesLines;
    readonly hiddenTilesManager: IHiddenTilesManager;
    readonly verticalOverlapsLines: ITileLine[];
}

export interface IPlacementStrategy {
    /**
     * Placing tiles in a row.
     * @param tile The target tile.
     * @param context The context with additional data.
     * @returns true if the placement is successful.
     */
    place(tile: ITile, context: IPlacementContext): boolean;
}
