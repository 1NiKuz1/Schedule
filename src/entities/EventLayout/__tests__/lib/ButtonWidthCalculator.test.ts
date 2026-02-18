import { describe, it, expect } from "vitest";
import { ButtonWidthCalculator } from "../../lib";

describe("Entities/EventLayout/lib/ButtonWidthCalculator", () => {
    describe("calculate", () => {
        it("I must correctly calculate the estimated width of the button as a percentage.", () => {
            const containerWidth = 1000;
            expect(ButtonWidthCalculator.calculate(containerWidth)).toBe(3);
        });

        it("Must correctly handle the zero width of the container.", () => {
            expect(ButtonWidthCalculator.calculate(0)).toBe(0);
        });

        it("Must limit the maximum width of the button to 100%", () => {
            const containerWidth = 10;
            const result = ButtonWidthCalculator.calculate(containerWidth);
            expect(result).toBe(100);
        });

        it("Must accurately calculate fractional values", () => {
            const containerWidth = 750;
            expect(ButtonWidthCalculator.calculate(containerWidth)).toBe(4);
        });
    });
});
