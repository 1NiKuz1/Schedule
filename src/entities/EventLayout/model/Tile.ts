import type { IEvent } from "@shared/typings";
import { getElementAt, required, validate } from "@shared/lib";
import type { ITile, IVerticalBoundaries, IBoundaries } from "./typings";
import { LinkedOverlapEntity } from "./structures";
import { BoundaryUtils, FloatComparator } from "../lib";

export class Tile extends LinkedOverlapEntity<ITile> implements ITile {
    public readonly id: string;
    public readonly start: Date;
    public readonly end: Date;
    public readonly title: string;
    public readonly bgColorClass: string | undefined;
    public readonly top: number;
    public readonly bottom: number;
    public left: number = 0;
    public height: number = 0;
    public width: number = 100;
    public lineKey: IBoundaries | null = null;
    public hiddenKey: IVerticalBoundaries | null = null;

    constructor(event: IEvent) {
        super();
        this.id = event.id;
        this.start = event.start;
        this.end = event.end;
        this.title = event.title;
        this.bgColorClass = event.bgColorClass;
        const boundaries = BoundaryUtils.calcVerticalBoundaries(event);
        this.top = boundaries.top;
        this.bottom = boundaries.bottom;
    }

    public get right() {
        return this.left + this.width;
    }

    public get boundaries(): IBoundaries {
        return {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom
        };
    }

    @validate
    public addNext(@required entity: ITile): boolean {
        if (!this.isNeighbour(entity, true)) {
            return false;
        }
        super.addNext(entity);
        this.purgeInvalidLinks(true);
        return true;
    }

    @validate
    public addPrev(@required entity: ITile): boolean {
        if (!this.isNeighbour(entity, false)) {
            return false;
        }
        super.addPrev(entity);
        this.purgeInvalidLinks(false);
        return true;
    }

    @validate
    public addOverlap(@required entity: ITile): boolean {
        if (!BoundaryUtils.hasVerticalOverlap(this, entity)) {
            return false;
        }
        super.addOverlap(entity);
        return true;
    }

    @validate
    public isNeighbour(@required neighbour: ITile, @required isNext: boolean): boolean {
        const tileBoundary = isNext ? this.right : this.left;
        const neighbourBoundary = isNext ? neighbour.left : neighbour.right;
        return FloatComparator.equal(tileBoundary, neighbourBoundary);
    }

    public fillNeighbours(): void {
        for (const tile of this.overlaps) {
            if (tile.addNext(this)) {
                continue;
            }
            tile.addPrev(this);
        }
    }

    private purgeInvalidLinks(isNext: boolean): void {
        const links = isNext ? this.next : this.prev;
        for (let i = links.length - 1; i >= 0; i--) {
            const tile: ITile = getElementAt(links, i);
            if (!this.isNeighbour(tile, isNext)) {
                if (isNext) {
                    this.removeNext(tile);
                } else {
                    this.removePrev(tile);
                }
            }
        }
    }
}
