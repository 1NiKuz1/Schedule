/** API for working with debounce. */
export function createDebounce(callback: Function, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debouncedFunction = (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback(...args);
            timeoutId = null;
        }, delay);
    };

    // Cleaning function
    const cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return {
        debouncedFunction,
        cancel
    };
}
