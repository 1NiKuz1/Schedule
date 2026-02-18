export interface IVerticalBoundaries {
    top: number;
    bottom: number;
}

export interface IHorizontalBoundaries {
    left: number;
    right: number;
}

export interface IBoundaries extends IVerticalBoundaries, IHorizontalBoundaries {}
export interface IBaseEvent {
    id: string;
    title: string;
    description?: string;
    bgColorClass?: string;
    height?: string | number;
}

export interface ITimeBoundaries {
    start: Date;
    end: Date;
}

export interface IEvent extends IBaseEvent, ITimeBoundaries {}
