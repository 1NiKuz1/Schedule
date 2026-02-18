import { required, validate } from "@shared/lib";
import type { IBoundaries, ITileLine, ITile, IHorizontalBoundaries, IVerticalBoundaries } from "./typings";
import { BoundaryUtils } from "../lib";

export class TileLine implements ITileLine {
    public boundaries: IBoundaries;
    public tiles: ITile[] = [];

    constructor(boundaries: IBoundaries) {
        this.boundaries = boundaries;
    }

    @validate
    public addTile(@required tile: ITile): void {
        if (!this.tiles.includes(tile)) {
            tile.lineKey = this.boundaries;
            this.tiles.push(tile);
            BoundaryUtils.expandVerticalBoundaries(this.boundaries, tile);
        }
    }

    @validate
    public removeTile(@required tile: ITile): void {
        const index = this.tiles.indexOf(tile);
        if (index !== -1) {
            this.tiles[index]!.deleteAllLinks();
            this.tiles[index]!.deleteAllOverlaps();
            this.tiles.splice(index, 1);
            BoundaryUtils.overwriteVerticalBoundaries(this.boundaries, this.getLineVerticalBoundariesBasedTiles());
        }
    }

    @validate
    public overwriteHorizontalBoundaries(@required boundaries: IHorizontalBoundaries): void {
        const tiles: ITile[] = this.tiles;
        this.boundaries.left = boundaries.left;
        this.boundaries.right = boundaries.right;
        BoundaryUtils.distributeTilesUniformly(tiles, boundaries);
    }

    private getLineVerticalBoundariesBasedTiles(): IVerticalBoundaries {
        if (!this.tiles.length) {
            return { top: 0, bottom: 0 };
        }
        const newBoundaries: IVerticalBoundaries = { top: 100, bottom: 0 };
        for (const tile of this.tiles) {
            BoundaryUtils.expandVerticalBoundaries(newBoundaries, tile);
        }
        return newBoundaries;
    }
}
