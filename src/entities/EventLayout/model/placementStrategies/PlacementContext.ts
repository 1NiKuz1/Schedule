import type { IHiddenTilesManager, ITilesLines, IPlacementContext, ITileLine } from "../typings";

export class PlacementContext implements IPlacementContext {
    public readonly containerWidth: number;
    public readonly tilesLines: ITilesLines;
    public readonly hiddenTilesManager: IHiddenTilesManager;
    public readonly verticalOverlapsLines: ITileLine[];

    constructor(containerWidth: number, tilesLines: ITilesLines, hiddenTilesManager: IHiddenTilesManager, overlappingLines: ITileLine[]) {
        this.containerWidth = containerWidth;
        this.tilesLines = tilesLines;
        this.hiddenTilesManager = hiddenTilesManager;
        this.verticalOverlapsLines = overlappingLines;
    }
}
