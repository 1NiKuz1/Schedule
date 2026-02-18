import { describe, it, expect, vi } from "vitest";
import { IEvent } from "@shared/typings";
import { Sizes } from "@shared/config";
import { BoundaryUtils, FloatComparator, EventUtils } from "../../lib";

describe("Entities/EventLayout/lib/BoundaryUtils", () => {
    describe("hasVerticalOverlap", () => {
        it("Must detect vertical overlap", () => {
            const a = { top: 10, bottom: 20 };
            const b = { top: 15, bottom: 25 };
            expect(BoundaryUtils.hasVerticalOverlap(a, b)).toBe(true);
        });

        it("It should not detect vertical overlap when there is no intersection", () => {
            const a = { top: 10, bottom: 20 };
            const b = { top: 30, bottom: 40 };
            expect(BoundaryUtils.hasVerticalOverlap(a, b)).toBe(false);
        });

        it("Must handle boundary values correctly (taking into account EPSILON)", () => {
            const a = { top: 10, bottom: 20 };
            const b = {
                top: 20 - FloatComparator.EPSILON * 0.5,
                bottom: 30
            };
            expect(BoundaryUtils.hasVerticalOverlap(a, b)).toBe(false);
        });
    });

    describe("hasHorizontalOverlap", () => {
        it("Must detect horizontal overlap", () => {
            const a = { left: 10, right: 20 };
            const b = { left: 15, right: 25 };
            expect(BoundaryUtils.hasHorizontalOverlap(a, b)).toBe(true);
        });

        it("It should not detect horizontal overlap when there is no intersection.", () => {
            const a = { left: 10, right: 20 };
            const b = { left: 30, right: 40 };
            expect(BoundaryUtils.hasHorizontalOverlap(a, b)).toBe(false);
        });

        it("Must handle boundary values correctly (taking into account EPSILON)", () => {
            const a = { left: 10, right: 20 };
            const b = {
                left: 20 - FloatComparator.EPSILON * 0.5,
                right: 30
            };
            expect(BoundaryUtils.hasHorizontalOverlap(a, b)).toBe(false);
        });
    });

    describe("calcEmptyHorizontalSpaces", () => {
        it("It should return an array with the widest possible space", () => {
            expect(BoundaryUtils.calcEmptyHorizontalSpaces([])).toEqual([{ left: 0, right: 100 }]);
        });

        it("Must calculate empty spaces correctly", () => {
            const spaces = [
                { left: 20, right: 30 },
                { left: 10, right: 15 }
            ];

            const result = BoundaryUtils.calcEmptyHorizontalSpaces(spaces);

            expect(result).toEqual([
                { left: 0, right: 10 },
                { left: 15, right: 20 },
                { left: 30, right: 100 }
            ]);
        });

        it("Must handle adjacent borders", () => {
            const spaces = [
                { left: 0, right: 50 },
                { left: 50, right: 100 }
            ];

            const result = BoundaryUtils.calcEmptyHorizontalSpaces(spaces);
            expect(result).toEqual([]);
        });

        it("Must handle overlapping borders", () => {
            const spaces = [
                { left: 10, right: 40 },
                { left: 20, right: 30 },
                { left: 15, right: 25 }
            ];

            const result = BoundaryUtils.calcEmptyHorizontalSpaces(spaces);
            expect(result).toEqual([
                { left: 0, right: 10 },
                { left: 40, right: 100 }
            ]);
        });

        it("It should return an empty array with 100% coverage", () => {
            const spaces = [
                { left: 0, right: 30 },
                { left: 30, right: 60 },
                { left: 60, right: 100 }
            ];
            expect(BoundaryUtils.calcEmptyHorizontalSpaces(spaces)).toEqual([]);
        });
    });

    describe("findWidestHorizontalBoundaries", () => {
        it("Must return null for an empty input", () => {
            expect(BoundaryUtils.findWidestHorizontalBoundaries([])).toBeNull();
        });

        it("Must find the widest possible space", () => {
            const spaces = [
                { left: 0, right: 30 },
                { left: 40, right: 100 }
            ];

            const result = BoundaryUtils.findWidestHorizontalBoundaries(spaces);
            expect(result).toEqual({ left: 40, right: 100 });
        });

        it("Must compare the width correctly", () => {
            const spaces = [
                { left: 0, right: 50 },
                { left: 60, right: 90 },
                { left: 91, right: 100 }
            ];

            const result = BoundaryUtils.findWidestHorizontalBoundaries(spaces);
            expect(result).toEqual({ left: 0, right: 50 });
        });

        it("Should return the first space with the same width", () => {
            const spaces = [
                { left: 0, right: 50 },
                { left: 50, right: 100 }
            ];
            const result = BoundaryUtils.findWidestHorizontalBoundaries(spaces);
            expect(result).toEqual(spaces[0]);
        });
    });

    describe("expandVerticalBoundaries", () => {
        it("Must expand the vertical boundaries", () => {
            const target = { top: 10, bottom: 20 };
            const boundaries = { top: 5, bottom: 25 };

            BoundaryUtils.expandVerticalBoundaries(target, boundaries);
            expect(target).toEqual({ top: 5, bottom: 25 });
        });
    });

    describe("expandHorizontalBoundaries", () => {
        it("Must expand the horizontal boundaries", () => {
            const target = { left: 10, right: 20 };
            const boundaries = { left: 5, right: 25 };

            BoundaryUtils.expandHorizontalBoundaries(target, boundaries);
            expect(target).toEqual({ left: 5, right: 25 });
        });
    });

    describe("expandBoundaries", () => {
        it("Must expand the boundaries", () => {
            const target = { left: 10, right: 20, top: 10, bottom: 20 };
            const boundaries = { left: 5, right: 25, top: 5, bottom: 25 };

            BoundaryUtils.expandBoundaries(target, boundaries);
            expect(target).toEqual({ left: 5, right: 25, top: 5, bottom: 25 });
        });
    });

    describe("overwriteVerticalBoundaries", () => {
        it("Must expand the vertical boundaries", () => {
            const target = { top: 10, bottom: 20 };
            const boundaries = { top: 5, bottom: 25 };

            BoundaryUtils.overwriteVerticalBoundaries(target, boundaries);
            expect(target).toEqual({ top: 5, bottom: 25 });
        });
    });

    describe("overwriteHorizontalBoundaries", () => {
        it("Must expand the horizontal boundaries", () => {
            const target = { left: 10, right: 20 };
            const boundaries = { left: 5, right: 25 };

            BoundaryUtils.overwriteHorizontalBoundaries(target, boundaries);
            expect(target).toEqual({ left: 5, right: 25 });
        });
    });

    describe("overwriteBoundaries", () => {
        it("Must overwrite borders", () => {
            const target = { left: 10, right: 20, top: 10, bottom: 20 };
            const boundaries = { left: 5, right: 25, top: 5, bottom: 25 };

            BoundaryUtils.expandBoundaries(target, boundaries);
            expect(target).toEqual({ left: 5, right: 25, top: 5, bottom: 25 });
        });
    });

    describe("distributeTilesUniformly", () => {
        it("It should evenly distribute the tiles", () => {
            const tiles = [
                { left: 0, width: 0 },
                { left: 0, width: 0 }
            ] as any;

            const boundaries = { left: 0, right: 100 };

            BoundaryUtils.distributeTilesUniformly(tiles, boundaries);

            expect(tiles[0]).toEqual({ left: 0, width: 50 });
            expect(tiles[1]).toEqual({ left: 50, width: 50 });
        });

        it("Must work with boundaries not starting from zero", () => {
            const tiles = [{ left: 0, width: 0 }] as any;

            const boundaries = { left: 20, right: 100 };

            BoundaryUtils.distributeTilesUniformly(tiles, boundaries);
            expect(tiles[0]).toEqual({ left: 20, width: 80 });
        });

        it("It should not fall when the array of tiles is empty.", () => {
            const tiles = [] as any;
            const boundaries = { left: 0, right: 100 };
            expect(() => {
                BoundaryUtils.distributeTilesUniformly(tiles, boundaries);
            }).not.toThrow();
        });
    });

    describe("calcVerticalBoundaries", () => {
        it("Must calculate the vertical boundaries of the event", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0), // 10:00
                end: new Date(2023, 0, 1, 11, 0) // 11:00
            } as IEvent;

            vi.spyOn(EventUtils, "calcEventTop").mockReturnValue(100);
            vi.spyOn(EventUtils, "calcEventHeight").mockReturnValue(50);

            const result = BoundaryUtils.calcVerticalBoundaries(event);
            expect(result).toEqual({ top: 100, bottom: 150 });
        });

        it("Must correctly calculate the vertical boundaries for a short event", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0), // 10:00
                end: new Date(2023, 0, 1, 11, 0) // 11:00
            } as IEvent;

            vi.spyOn(EventUtils, "calcEventTop").mockReturnValue(100);
            vi.spyOn(EventUtils, "calcEventHeight").mockReturnValue(Sizes.MIN_HEIGHT_SCHEDULE_BLOCK);

            const result = BoundaryUtils.calcVerticalBoundaries(event);
            expect(result).toEqual({ top: 100, bottom: 100 + Sizes.MIN_HEIGHT_SCHEDULE_BLOCK + Sizes.INDENT_SCHEDULE_BLOCK });
        });

        it("Must correctly handle a zero-duration event", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 10, 0)
            } as IEvent;

            vi.spyOn(EventUtils, "calcEventTop").mockReturnValue(100);
            vi.spyOn(EventUtils, "calcEventHeight").mockReturnValue(0);

            const result = BoundaryUtils.calcVerticalBoundaries(event);
            expect(result.bottom).toBeCloseTo(100 + Sizes.MIN_HEIGHT_SCHEDULE_BLOCK + Sizes.INDENT_SCHEDULE_BLOCK);
        });
    });

    const testImmutable = (method: Function) => {
        it("Must not change the original boundaries", () => {
            const target = { top: 10, bottom: 20 };
            const source = { top: 5, bottom: 25 };
            const sourceCopy = { ...source };

            method(target, source);
            expect(source).toEqual(sourceCopy);
        });
    };

    describe("expandVerticalBoundaries", () => testImmutable(BoundaryUtils.expandVerticalBoundaries));
    describe("expandHorizontalBoundaries", () => testImmutable(BoundaryUtils.expandHorizontalBoundaries));
    describe("expandBoundaries", () => testImmutable(BoundaryUtils.expandBoundaries));
    describe("overwriteVerticalBoundaries", () => testImmutable(BoundaryUtils.overwriteVerticalBoundaries));
    describe("overwriteHorizontalBoundaries", () => testImmutable(BoundaryUtils.overwriteHorizontalBoundaries));
    describe("overwriteBoundaries", () => testImmutable(BoundaryUtils.overwriteBoundaries));
});
