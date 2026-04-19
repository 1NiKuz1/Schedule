import { getElementAt, required, validate } from "@shared/lib";
import type { ILinkedEntity } from "../typings";
export abstract class LinkedEntity<T extends ILinkedEntity<T>> implements ILinkedEntity<T> {
    public next: T[] = [];
    public prev: T[] = [];

    @validate
    public addNext(@required entity: T): boolean {
        if ((this as unknown as T) !== entity && !this.next.includes(entity)) {
            this.next.push(entity);
            entity.addPrev(this as unknown as T);
            return true;
        }
        return false;
    }

    @validate
    public addPrev(@required entity: T): boolean {
        if ((this as unknown as T) !== entity && !this.prev.includes(entity)) {
            this.prev.push(entity);
            entity.addNext(this as unknown as T);
            return true;
        }
        return false;
    }

    @validate
    public removeNext(@required entity: T): void {
        const index = this.next.indexOf(entity);
        if (index !== -1) {
            this.next.splice(index, 1);
            entity.removePrev(this as unknown as T);
        }
    }

    @validate
    public removePrev(@required entity: T): void {
        const index = this.prev.indexOf(entity);
        if (index !== -1) {
            this.prev.splice(index, 1);
            entity.removeNext(this as unknown as T);
        }
    }

    public deleteAllLinks() {
        while (this.next.length) {
            this.removeNext(getElementAt(this.next, 0));
        }
        while (this.prev.length) {
            this.removePrev(getElementAt(this.prev, 0));
        }
    }
}
