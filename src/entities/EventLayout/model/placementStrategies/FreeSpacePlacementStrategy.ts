import type { IPlacementContext, ITile, IHorizontalBoundaries } from "../typings";
import { BoundaryUtils } from "../../lib";
import { AbstractStrategy } from "./AbstractStrategy";

export class FreeSpacePlacementStrategy extends AbstractStrategy {
    public place(tile: ITile, context: IPlacementContext): boolean {
        super.place(tile, context);
        const emptySpaces: IHorizontalBoundaries[] = BoundaryUtils.calcEmptyHorizontalSpaces(tile.overlaps.map(t => t.boundaries));
        const widestBoundaries: IHorizontalBoundaries | null = BoundaryUtils.findWidestHorizontalBoundaries(emptySpaces);
        if (!widestBoundaries || (widestBoundaries && !this.isTilePlacementValid(tile, widestBoundaries, context.containerWidth))) {
            return false;
        }
        tile.left = widestBoundaries.left;
        tile.width = widestBoundaries.right - widestBoundaries.left;
        context.tilesLines.addLine(tile);
        tile.fillNeighbours();
        for (const line of context.verticalOverlapsLines) {
            if (BoundaryUtils.hasHorizontalOverlap(tile, line.boundaries)) {
                context.tilesLines.redistributeLineTiles(line);
                break;
            }
        }
        return true;
    }
}
