import ResizeObserverPolyfill from "resize-observer-polyfill";
const callbacks = new Map();
let observer: ResizeObserverPolyfill | null;

export const resizeObserver = {
    observe(target: Element, callback) {
        if (!observer) {
            observer = new ResizeObserverPolyfill(entries => {
                for (const entry of entries) {
                    const callback = callbacks.get(entry.target);
                    if (callback) {
                        callback(entry);
                    }
                }
            });
        }
        callbacks.set(target, callback);
        observer.observe(target);
    },

    unobserve(target: Element) {
        if (!observer) {
            return;
        }
        callbacks.delete(target);
        observer.unobserve(target);
        if (callbacks.size === 0) {
            observer.disconnect();
            observer = null;
        }
    }
};
