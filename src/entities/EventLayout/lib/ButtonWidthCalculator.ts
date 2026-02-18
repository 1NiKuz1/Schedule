export class ButtonWidthCalculator {
    private static readonly CHAR_WIDTH: number = 8; // Average width of a digit in pixels
    private static readonly PADDING: number = 6; // Margins in pixels
    private static readonly COUNT_OF_CHAR: number = 3;

    /**
     * Estimated calculation of the button width as a percentage.
     * @param hiddenCount The number of hidden tiles.
     * @param containerWidth The width of the container in pixels.
     * @returns The width of the button as a percentage.
     */
    public static calculate(containerWidth: number): number {
        if (containerWidth === 0) {
            return 0;
        }
        const widthPx = this.COUNT_OF_CHAR * this.CHAR_WIDTH + this.PADDING;
        const buttonWidth: number = (widthPx / containerWidth) * 100;
        return Math.min(buttonWidth, 100);
    }
}
