/**
 * Safely retrieves an element from an array at the specified index.
 * Provides a runtime guarantee that the returned value is not `undefined`
 * when the index is within bounds.
 */
export function getElementAt<T>(arr: T[], index: number): T {
    if (index < 0 || index >= arr.length) {
        throw new Error(`Index ${index} out of bounds for array of length ${arr.length}`);
    }
    return arr[index] as T;
}
