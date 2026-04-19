import { getElementAt, required, validate } from "@shared/lib";
import { type ILinkedOverlapEntity } from "../typings";
import { LinkedEntity } from ".";
export abstract class LinkedOverlapEntity<T extends ILinkedOverlapEntity<T>> extends LinkedEntity<T> implements ILinkedOverlapEntity<T> {
    public overlaps: T[] = [];

    @validate
    public addOverlap(@required entity: T): boolean {
        if ((this as unknown as T) !== entity && !this.overlaps.includes(entity)) {
            this.overlaps.push(entity);
            entity.addOverlap(this as unknown as T);
            return true;
        }
        return false;
    }

    @validate
    public removeOverlap(@required entity: T): void {
        const index = this.overlaps.indexOf(entity);
        if (index !== -1) {
            this.overlaps.splice(index, 1);
            entity.removeOverlap(this as unknown as T);
        }
    }

    public deleteAllOverlaps() {
        while (this.overlaps.length) {
            this.removeOverlap(getElementAt(this.overlaps, 0));
        }
    }
}
