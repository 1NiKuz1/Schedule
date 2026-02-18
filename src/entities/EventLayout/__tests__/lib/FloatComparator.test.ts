import { describe, it, expect } from "vitest";
import { FloatComparator } from "../../lib";

describe("Entities/EventLayout/lib/FloatComparator", () => {
    describe("equal", () => {
        it("Should return true for numbers that differ by less than an EPSILON.", () => {
            expect(FloatComparator.equal(0.1 + 0.2, 0.3)).toBe(true);
        });

        it("Should return true for EPSILON-adjusted numbers", () => {
            const a = 0.3;
            const b = 0.3 + FloatComparator.EPSILON;
            expect(FloatComparator.equal(a, b)).toBe(true);
        });

        it("Should return false for numbers that differ by more than EPSILON", () => {
            expect(FloatComparator.equal(0.1, 0.2)).toBe(false);
        });

        it("It must work correctly with very large numbers", () => {
            const big = 1e15;
            expect(FloatComparator.equal(big, big + FloatComparator.EPSILON)).toBe(true);
            expect(FloatComparator.equal(big, big + 1)).toBe(false);
        });
    });

    describe("greater", () => {
        it("Should return true if the first number is greater than the second on EPSILON", () => {
            expect(FloatComparator.greater(0.3, 0.2)).toBe(true);
        });

        it("Should return false if the first number is less than the second", () => {
            expect(FloatComparator.greater(0.1, 0.2)).toBe(false);
        });

        it("Should return false if the numbers are equal taking into account EPSILON", () => {
            const a = 0.3;
            const b = 0.3 + FloatComparator.EPSILON / 2;
            expect(FloatComparator.greater(a, b)).toBe(false);
        });

        it("Must correctly compare with zero", () => {
            expect(FloatComparator.greater(FloatComparator.EPSILON * 1.1, 0)).toBe(true);
            expect(FloatComparator.greater(FloatComparator.EPSILON * 0.9, 0)).toBe(false);
        });
    });

    describe("less", () => {
        it("Should return true if the first number is less than the second on EPSILON", () => {
            expect(FloatComparator.less(0.1, 0.2)).toBe(true);
        });

        it("Should return false if the first number is greater than the second", () => {
            expect(FloatComparator.less(0.3, 0.2)).toBe(false);
        });

        it("Should return false if the numbers are equal taking into account EPSILON", () => {
            const a = 0.3;
            const b = 0.3 - FloatComparator.EPSILON / 2;
            expect(FloatComparator.less(a, b)).toBe(false);
        });

        it("Must work correctly with negative numbers", () => {
            expect(FloatComparator.less(-0.2, -0.1)).toBe(true);
            expect(FloatComparator.less(-0.1, -0.1 - FloatComparator.EPSILON * 0.5)).toBe(false);
        });
    });

    describe("relativeEqual", () => {
        it("Should return true for numbers that are relatively equal", () => {
            const a = 1000.0;
            const b = 1000.0 + FloatComparator.EPSILON * 1000;
            expect(FloatComparator.relativeEqual(a, b)).toBe(true);
        });

        it("Should return false for numbers that are not relatively equal", () => {
            const a = 1000.0;
            const b = 1000.0 + FloatComparator.EPSILON * 10000;
            expect(FloatComparator.relativeEqual(a, b)).toBe(false);
        });

        it("Must work correctly with zeros", () => {
            expect(FloatComparator.relativeEqual(0, 0)).toBe(true);
            expect(FloatComparator.relativeEqual(0, FloatComparator.EPSILON)).toBe(false);
        });

        it("Must work correctly with very small numbers", () => {
            const small = 1e-15;
            expect(FloatComparator.relativeEqual(small, small * (1 + FloatComparator.EPSILON * 0.5))).toBe(true);
            expect(FloatComparator.relativeEqual(small, small * (1 + FloatComparator.EPSILON * 2))).toBe(false);
        });
    });
});
