export interface ILinkedEntity<T> {
    next: T[];
    prev: T[];
    addNext(entity: T): boolean;
    addPrev(entity: T): boolean;
    removeNext(entity: T): void;
    removePrev(entity: T): void;
    deleteAllLinks(): void;
}

export interface IOverlapEntity<T> {
    overlaps: T[];
    addOverlap(entity: T): boolean;
    removeOverlap(entity: T): void;
    deleteAllOverlaps(): void;
}

export interface ILinkedOverlapEntity<T> extends ILinkedEntity<T>, IOverlapEntity<T> {}
