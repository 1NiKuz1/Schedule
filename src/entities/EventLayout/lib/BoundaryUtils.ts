import { required, validate } from "@shared/lib";
import type { IEvent } from "@shared/typings";
import { Sizes } from "@shared/config";
import type { IVerticalBoundaries, IHorizontalBoundaries, IBoundaries, ITile } from "../model/typings";
import { FloatComparator, EventUtils } from ".";
export class BoundaryUtils {
    /** Checking vertical border crossings. */
    @validate
    public static hasVerticalOverlap(@required a: IVerticalBoundaries, @required b: IVerticalBoundaries): boolean {
        return FloatComparator.greater(b.bottom, a.top) && FloatComparator.greater(a.bottom, b.top);
    }

    /** Checking horizontal border crossings. */
    @validate
    public static hasHorizontalOverlap(@required a: IHorizontalBoundaries, @required b: IHorizontalBoundaries): boolean {
        return FloatComparator.greater(b.right, a.left) && FloatComparator.greater(a.right, b.left);
    }

    /** Calculating the horizontal boundaries of unoccupied tiles. */
    @validate
    public static calcEmptyHorizontalSpaces(@required horizontalSpaces: IHorizontalBoundaries[]): IHorizontalBoundaries[] {
        if (!horizontalSpaces.length) {
            return [{ left: 0, right: 100 }];
        }
        const occupied: IHorizontalBoundaries[] = horizontalSpaces.sort((a, b) => a.left - b.left);
        let current = 0;
        const emptySpaces: IHorizontalBoundaries[] = [];
        for (const { left, right } of occupied) {
            if (FloatComparator.greater(left, current)) {
                emptySpaces.push({
                    left: current,
                    right: left
                });
            }
            current = Math.max(current, right);
        }
        if (FloatComparator.greater(100, current)) {
            emptySpaces.push({
                left: current,
                right: 100
            });
        }
        return emptySpaces;
    }

    /** Getting the widest possible horizontal borders. */
    @validate
    public static findWidestHorizontalBoundaries(@required boundaries: IHorizontalBoundaries[]): IHorizontalBoundaries | null {
        if (!boundaries.length) {
            return null;
        }
        let widest = boundaries[0]!;
        let maxWidth = widest.right - widest.left;

        for (const boundary of boundaries.slice(1)) {
            const width = boundary.right - boundary.left;
            if (FloatComparator.greater(width, maxWidth)) {
                widest = boundary;
                maxWidth = width;
            }
        }

        return widest;
    }

    /** Overwriting the vertical borders to the maximum extreme values. */
    @validate
    public static expandVerticalBoundaries(@required target: IVerticalBoundaries, @required boundaries: IVerticalBoundaries): void {
        target.top = Math.min(target.top, boundaries.top);
        target.bottom = Math.max(target.bottom, boundaries.bottom);
    }

    /** Overwriting the horizontal borders to the maximum extreme values. */
    @validate
    public static expandHorizontalBoundaries(@required target: IHorizontalBoundaries, @required boundaries: IHorizontalBoundaries): void {
        target.left = Math.min(target.left, boundaries.left);
        target.right = Math.max(target.right, boundaries.right);
    }

    /** Overwriting the boundaries to the maximum extreme values. */
    @validate
    public static expandBoundaries(@required target: IBoundaries, @required boundaries: IBoundaries): void {
        target.top = Math.min(target.top, boundaries.top);
        target.bottom = Math.max(target.bottom, boundaries.bottom);
        target.left = Math.min(target.left, boundaries.left);
        target.right = Math.max(target.right, boundaries.right);
    }

    /** Overwriting vertical borders to new values. */
    @validate
    public static overwriteVerticalBoundaries(@required target: IVerticalBoundaries, @required boundaries: IVerticalBoundaries): void {
        target.top = boundaries.top;
        target.bottom = boundaries.bottom;
    }

    /** Overwriting the horizontal borders to new values. */
    @validate
    public static overwriteHorizontalBoundaries(
        @required target: IHorizontalBoundaries,
        @required boundaries: IHorizontalBoundaries
    ): void {
        target.left = boundaries.left;
        target.right = boundaries.right;
    }

    /** Overwriting borders to new values. */
    @validate
    public static overwriteBoundaries(@required target: IBoundaries, @required boundaries: IBoundaries): void {
        target.top = boundaries.top;
        target.bottom = boundaries.bottom;
        target.left = boundaries.left;
        target.right = boundaries.right;
    }

    /** Uniform distribution of horizontal tile boundaries. */
    @validate
    public static distributeTilesUniformly(@required tiles: ITile[], @required boundaries: IHorizontalBoundaries): void {
        if (!tiles.length) {
            return;
        }
        const width: number = boundaries.right - boundaries.left;
        const tileWidth: number = width / tiles.length;
        for (let i = 0; i < tiles.length; ++i) {
            tiles[i]!.width = tileWidth;
            tiles[i]!.left = boundaries.left + i * tileWidth;
        }
    }

    /** Calculation of vertical tile boundaries. */
    @validate
    public static calcVerticalBoundaries(@required event: IEvent): IVerticalBoundaries {
        const top = EventUtils.calcEventTop(event.start);
        let height = Math.max(EventUtils.calcEventHeight(event), Sizes.MIN_HEIGHT_SCHEDULE_BLOCK);
        height = height !== Sizes.MIN_HEIGHT_SCHEDULE_BLOCK ? height : height + Sizes.INDENT_SCHEDULE_BLOCK;
        return { top, bottom: top + height };
    }
}
