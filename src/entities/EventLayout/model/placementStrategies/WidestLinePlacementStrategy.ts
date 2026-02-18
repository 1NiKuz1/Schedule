import type { IPlacementContext, ITile, ITileLine, IHorizontalBoundaries } from "../typings";
import { BoundaryUtils, FloatComparator } from "../../lib";
import { AbstractStrategy } from "./AbstractStrategy";

export class WidestLinePlacementStrategy extends AbstractStrategy {
    public place(tile: ITile, context: IPlacementContext): boolean {
        super.place(tile, context);
        if (!context.verticalOverlapsLines.length) {
            return false;
        }
        return this.redistributeAndPlace(tile);
    }

    private redistributeAndPlace(tile: ITile): boolean {
        const optimalLine: ITileLine = this.findOptimalLine(this.context!.verticalOverlapsLines);
        const optimalLineWidth: number = optimalLine.boundaries.right - optimalLine.boundaries.left;
        const boundaries: IHorizontalBoundaries = {
            left: optimalLine.boundaries.right - optimalLineWidth / (optimalLine.tiles.length + 1),
            right: optimalLine.boundaries.right
        };
        if (this.isTilePlacementValid(tile, boundaries, this.context!.containerWidth)) {
            optimalLine.addTile(tile);
            BoundaryUtils.distributeTilesUniformly(optimalLine.tiles, optimalLine.boundaries);
            tile.fillNeighbours();
            return true;
        }
        return false;
    }

    private findOptimalLine(lines: ITileLine[]): ITileLine {
        let optimalLine = lines[0]!;
        let optimalWidth = this.calculateEffectiveWidth(optimalLine);

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i]!;
            const currentWidth = this.calculateEffectiveWidth(currentLine);

            if (FloatComparator.greater(currentWidth, optimalWidth)) {
                optimalLine = currentLine;
                optimalWidth = currentWidth;
                continue;
            }
            if (FloatComparator.equal(currentWidth, optimalWidth)) {
                if (currentLine.tiles.length < optimalLine.tiles.length) {
                    optimalLine = currentLine;
                }
            }
        }
        return optimalLine;
    }

    private calculateEffectiveWidth(line: ITileLine): number {
        return (line.boundaries.right - line.boundaries.left) / (line.tiles.length + 1);
    }
}
