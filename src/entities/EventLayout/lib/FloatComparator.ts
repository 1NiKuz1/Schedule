/** EPSILON is a comparison to account for calculation errors. */
export class FloatComparator {
    public static readonly EPSILON: number = 0.0001;
    /**Comparing floating-point numbers with an allowance for error. */
    public static equal(a: number, b: number): boolean {
        return Math.abs(a - b) <= FloatComparator.EPSILON;
    }

    /** Checking that the first number is strictly greater than the second, taking into account the error. */
    public static greater(a: number, b: number): boolean {
        return a - b > FloatComparator.EPSILON;
    }

    /** Checking that the first number is strictly less than the second, taking into account the error. */
    public static less(a: number, b: number): boolean {
        return b - a > FloatComparator.EPSILON;
    }

    /** Comparing floating-point numbers through relative error. */
    public static relativeEqual(a: number, b: number): boolean {
        return Math.abs(a - b) <= FloatComparator.EPSILON * Math.max(Math.abs(a), Math.abs(b));
    }
}
