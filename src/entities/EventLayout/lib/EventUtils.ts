import { required, validate, formatEventTimeRange } from "@shared/lib";
import type { IEvent } from "@shared/typings";
import { Sizes } from "@shared/config";

export class EventUtils {
    private static get rowHeightMultiplier(): number {
        return Sizes.ROW_HEIGHT / 60;
    }

    @validate
    public static getEventDescription(@required event: IEvent): string {
        return formatEventTimeRange(event.start, event.end);
    }

    /**
     * Calculation of the upper margin relative to the specified time.
     * @param date The date of the calculation.
     * @returnsThe The final indentation.
     */
    @validate
    public static calcEventTop(@required date: Date): number {
        return (date.getHours() * 60 + date.getMinutes()) * this.rowHeightMultiplier;
    }

    /**
     * Calculating the height of the event.
     * @param event The event that is being calculated for.
     * @returns The final height.
     */
    @validate
    public static calcEventHeight(@required event: IEvent): number {
        const height: number =
            ((event.end.getTime() - event.start.getTime()) / 60000) * this.rowHeightMultiplier - Sizes.INDENT_SCHEDULE_BLOCK;
        return Math.max(height, 0);
    }
}
