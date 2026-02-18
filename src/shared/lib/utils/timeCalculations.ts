import type { ITimeBoundaries } from "@shared/typings";
/** Calculation of the array of hours covered by time intervals within one day. */
export function getCoveredHours(boundaries: ITimeBoundaries[]): number[] {
    const msInHour = 3600000;
    const msInDay = 86400000;
    const coveredHours: Set<number> = new Set();
    for (const { start, end } of boundaries) {
        // Calculating the offsets relative to the beginning of the day
        const startOfDay = new Date(start);
        startOfDay.setHours(0, 0, 0, 0);
        const startOffset = Math.max(0, start.getTime() - startOfDay.getTime());
        const endOffset = Math.min(msInDay, end.getTime() - startOfDay.getTime());
        // Skip the empty intervals
        if (startOffset >= endOffset) {
            continue;
        }
        // Determining the first and last hour of the interval
        const firstHour = Math.floor(startOffset / msInHour);
        const lastHour = Math.min(23, Math.ceil(endOffset / msInHour) - 1);
        // Adding all the hours in the interval
        for (let hour = firstHour; hour <= lastHour; hour++) {
            coveredHours.add(hour);
        }
    }
    return [...coveredHours].sort((a, b) => a - b);
}
