/** Adjusts the width of the element to the scroll width of the parent element. */
export function adjustWidthToParentScroll(target: HTMLElement, parentElement?: HTMLElement): void {
    target.style.minWidth = "";
    const parent: HTMLElement | null = parentElement ? parentElement : target.parentElement;
    if (parent && parent.clientWidth !== parent.scrollWidth) {
        target.style.minWidth = parent.scrollWidth + "px";
    }
}
