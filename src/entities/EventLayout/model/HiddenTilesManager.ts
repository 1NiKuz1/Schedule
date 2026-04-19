import { required, validate } from "@shared/lib";
import { Sizes } from "@shared/config";
import type { ITile, IHiddenTilesManager, IVerticalBoundaries } from "./typings";
import { EventUtils, BoundaryUtils } from "../lib";

export class HiddenTilesManager implements IHiddenTilesManager {
    private _hiddenTilesMap: Map<IVerticalBoundaries, ITile[]> = new Map();
    private _hiddenKeysRegistry: Set<IVerticalBoundaries> = new Set();

    public get hiddenTilesMap(): Map<IVerticalBoundaries, ITile[]> {
        return this._hiddenTilesMap;
    }

    public get hiddenTiles(): ITile[] {
        let hiddenTiles: ITile[] = [];
        for (const tiles of this._hiddenTilesMap.values()) {
            hiddenTiles = [...tiles, ...hiddenTiles];
        }
        return hiddenTiles;
    }

    public get hiddenKeys(): IVerticalBoundaries[] {
        return [...this._hiddenKeysRegistry];
    }

    @validate
    public hasHiddenInRange(@required keyOfLine: IVerticalBoundaries): boolean {
        return this.hiddenKeys.some(key => BoundaryUtils.hasVerticalOverlap(key, keyOfLine) && this.getTilesByKey(key).length > 0);
    }

    @validate
    public getTilesByKey(@required key: IVerticalBoundaries): ITile[] {
        return this._hiddenTilesMap.get(key) ?? [];
    }

    @validate
    public registerHiddenKey(@required tile: ITile): IVerticalBoundaries {
        const existingKey = this.findMatchingKey(tile);
        if (existingKey) {
            tile.hiddenKey = existingKey;
            return existingKey;
        }
        const newKey: IVerticalBoundaries = this.createKeyForTile(tile);
        this._hiddenTilesMap.set(newKey, []);
        this._hiddenKeysRegistry.add(newKey);
        tile.hiddenKey = newKey;
        return newKey;
    }

    @validate
    public addTile(@required tile: ITile): boolean {
        if (!tile.hiddenKey) {
            return false;
        }
        const tiles: ITile[] | undefined = this._hiddenTilesMap.get(tile.hiddenKey);
        if (!tiles) {
            return false;
        }
        tiles.push(tile);
        return true;
    }

    @validate
    public removeTile(@required tile: ITile): boolean {
        if (!tile.hiddenKey) {
            return false;
        }
        const tiles: ITile[] | undefined = this._hiddenTilesMap.get(tile.hiddenKey);
        if (!tiles) {
            return false;
        }
        const filteredTiles: ITile[] = tiles.filter(t => t !== tile);
        this._hiddenTilesMap.set(tile.hiddenKey, filteredTiles);
        return true;
    }

    private findMatchingKey(tile: ITile): IVerticalBoundaries | undefined {
        return Array.from(this._hiddenTilesMap.keys()).find(key => BoundaryUtils.hasVerticalOverlap(key, tile));
    }

    private createKeyForTile(tile: ITile): IVerticalBoundaries {
        const key: IVerticalBoundaries = { top: 0, bottom: 0 };
        const roundedDate = new Date(tile.start);
        // Rounding up to half an hour
        roundedDate.setMinutes(tile.start.getMinutes() < 30 ? 0 : 30);
        key.top = EventUtils.calcEventTop(roundedDate);
        key.bottom = key.top + Sizes.ROW_HEIGHT / 2;
        return key;
    }
}
