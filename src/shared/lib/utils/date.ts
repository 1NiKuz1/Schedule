/**
 * Forming a string in the YYYY-mm-dd format based on the incoming date.
 * @param date The target date.
 * @param locale Localization of the format.
 * @returns The converted date as a string.
 */
export function formatDateToString(date: Date, locale: string = "fr-CA") {
    const formatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    return formatter.format(date);
}

/**
 * Date generation by string in the YYYY-mm-dd format.
 * @param dateStr The target date as a string.
 * @returns The converted string as a date.
 */
export function parseDate(dateStr: string): Date | null {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (typeof year === "number" && typeof month === "number") {
        return new Date(year, month - 1, day);
    }
    return null;
}

/**
 * Returns the name of the month based on the target date.
 * @param date The target date.
 * @param short Short record of the month.
 * @returns Name of the month.
 */
export function getMonthName(date: Date, short: boolean): string | undefined {
    const months = short
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return months[date.getMonth()];
}

/**
 * Checking if the date matches the YYYY-mm-dd format.
 * @param dateStr The target date as a string.
 */
export function isValidDate(dateStr: string): boolean {
    const dateReg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return dateReg.test(dateStr);
}

/**
 * Date conversion to hh:mm format.
 * @param date The target date.
 */
export function formatDateToTime(date: Date): string {
    return [date.getHours(), date.getMinutes()].map(num => num.toString().padStart(2, "0")).join(":");
}

/**
 * Forming a time string in the "hh:mm - hh:mm" format.
 * @param start The start date.
 * @param end The end date.
 */
export function formatEventTimeRange(start: Date, end: Date): string {
    return `${formatDateToTime(start)} - ${formatDateToTime(end)}`;
}
