import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { IEvent } from "@shared/typings";
import { Tile } from "../../model/Tile";
import { BoundaryUtils } from "../../lib";
import { FloatComparator } from "../../lib/FloatComparator";

const mockEvent = (id: string, start: Date, end: Date): IEvent => ({
    id,
    title: `Event ${id}`,
    start,
    end
});

describe("Entities/EventLayout/model/Tile", () => {
    let tileA: Tile;
    let tileB: Tile;
    let tileC: Tile;

    beforeEach(() => {
        tileA = new Tile(mockEvent("1", new Date("2023-10-01T00:30"), new Date("2023-10-01T01:30")));

        tileB = new Tile(mockEvent("1", new Date("2023-10-01T01:00"), new Date("2023-10-01T02:00")));

        tileC = new Tile(mockEvent("1", new Date("2023-10-01T00:00"), new Date("2023-10-01T01:00")));
    });

    describe("Constructor and properties", () => {
        it("Must initialize the properties correctly", () => {
            expect(tileA.id).toBe("1");
            expect(tileA.title).toBe("Event 1");
            expect(tileA.top).toBe(34);
            expect(tileA.bottom).toBe(100);
            expect(tileA.left).toBe(0);
            expect(tileA.width).toBe(100);
        });

        it("Must calculate right correctly", () => {
            tileA.left = 20;
            tileA.width = 30;
            expect(tileA.right).toBe(50);
        });

        it("Must return borders via boundaries", () => {
            tileA.left = 10;
            tileA.width = 20;
            expect(tileA.boundaries).toEqual({
                left: 10,
                right: 30,
                top: 34,
                bottom: 100
            });
        });

        it("Must update boundaries when left/width changes", () => {
            tileA.left = 20;
            tileA.width = 30;

            expect(tileA.boundaries.left).toBe(20);
            expect(tileA.boundaries.right).toBe(50);

            tileA.width = 40;
            expect(tileA.boundaries.right).toBe(60);
        });
    });

    describe("isNeighbour", () => {
        it("Should return true for neighbors on the right", () => {
            tileA.left = 0;
            tileA.width = 50;
            tileB.left = 50;
            tileB.width = 50;

            expect(tileA.isNeighbour(tileB, true)).toBe(true);
        });

        it("Should return true for the neighbors on the left", () => {
            tileA.left = 50;
            tileA.width = 50;
            tileB.left = 0;
            tileB.width = 50;

            expect(tileA.isNeighbour(tileB, false)).toBe(true);
        });

        it("Should return false if there is no neighborhood", () => {
            tileA.left = 0;
            tileA.width = 40;
            tileB.left = 50;
            tileB.width = 50;

            expect(tileA.isNeighbour(tileB, true)).toBe(false);
        });

        it("Must take into account the error when comparing", () => {
            tileA.left = 0;
            tileA.width = 50;
            tileB.left = 50 + FloatComparator.EPSILON / 2;
            tileB.width = 50;

            expect(tileA.isNeighbour(tileB, true)).toBe(true);
        });
    });

    describe("addOverlap", () => {
        it("Must add overlap at a vertical intersection", () => {
            vi.spyOn(BoundaryUtils, "hasVerticalOverlap").mockReturnValue(true);

            tileA.addOverlap(tileB);

            expect(tileA.overlaps).toContain(tileB);
            expect(tileB.overlaps).toContain(tileA);
        });

        it("Should not add overlap without vertical intersection", () => {
            vi.spyOn(BoundaryUtils, "hasVerticalOverlap").mockReturnValue(false);

            tileA.addOverlap(tileC);

            expect(tileA.overlaps).not.toContain(tileC);
            expect(tileC.overlaps).not.toContain(tileA);
        });

        it("Must not add duplicates", () => {
            vi.spyOn(BoundaryUtils, "hasVerticalOverlap").mockReturnValue(true);

            tileA.addOverlap(tileB);
            tileA.addOverlap(tileB);

            expect(tileA.overlaps.length).toBe(1);
        });
    });

    describe("fillNeighbours", () => {
        it("Must fill in next/prev connections based on overlaps", () => {
            tileA.overlaps = [tileB, tileC];
            tileB.overlaps = [tileA];
            tileC.overlaps = [tileA];

            tileA.left = 0;
            tileA.width = 50;
            tileB.left = 50;
            tileB.width = 50;
            tileC.left = 0;
            tileC.width = 30;

            tileA.fillNeighbours();

            expect(tileA.next).toContain(tileB);
            expect(tileB.prev).toContain(tileA);

            expect(tileA.next).not.toContain(tileC);
            expect(tileA.prev).not.toContain(tileC);
        });

        it("Should not create connections without neighborhood", () => {
            tileA.overlaps = [tileB];
            tileB.overlaps = [tileA];

            tileA.left = 0;
            tileA.width = 40;
            tileB.left = 50;
            tileB.width = 50;

            tileA.fillNeighbours();

            expect(tileA.next).toHaveLength(0);
            expect(tileB.prev).toHaveLength(0);
        });
    });

    describe("addNext and addPrev", () => {
        it("Must add a link only if the neighborhood condition is met.", () => {
            tileA.left = 0;
            tileA.width = 50;
            tileB.left = 50;
            tileB.width = 50;

            const result = tileA.addNext(tileB);

            expect(result).toBe(true);
            expect(tileA.next).toContain(tileB);
            expect(tileB.prev).toContain(tileA);
        });

        it("Should not add a connection without a neighborhood", () => {
            tileA.left = 0;
            tileA.width = 40;
            tileB.left = 50;
            tileB.width = 50;

            const result = tileA.addNext(tileB);

            expect(result).toBe(false);
            expect(tileA.next).not.toContain(tileB);
            expect(tileB.prev).not.toContain(tileA);
        });

        it("Must clear invalid links after adding", () => {
            tileA.next = [tileB, tileC];
            tileB.prev = [tileA];
            tileC.prev = [tileA];

            tileA.left = 0;
            tileA.width = 50;
            tileB.left = 50;
            tileB.width = 50;
            tileC.left = 60;

            tileA.addNext(tileB);

            expect(tileA.next).toEqual([tileB]);
            expect(tileB.prev).toEqual([tileA]);
            expect(tileC.prev).toEqual([]);
        });

        it("Should not add itself as next", () => {
            expect(tileA.addNext(tileA)).toBe(false);
            expect(tileA.next).not.toContain(tileA);
        });

        it("Should not add myself as prev", () => {
            expect(tileA.addPrev(tileA)).toBe(false);
            expect(tileA.prev).not.toContain(tileA);
        });
    });

    describe("purgeInvalidLinks", () => {
        it("Must delete invalid next links", () => {
            tileA.next = [tileB, tileC];

            tileA.left = 0;
            tileA.width = 50;
            tileB.left = 50;
            tileB.width = 50;
            tileC.left = 60;

            tileA["purgeInvalidLinks"](true);

            expect(tileA.next).toEqual([tileB]);
        });

        it("Must delete invalid prev connections", () => {
            tileA.prev = [tileB, tileC];

            tileA.left = 50;
            tileA.width = 50;
            tileB.left = 0;
            tileB.width = 50;
            tileC.left = 10;

            tileA["purgeInvalidLinks"](false);

            expect(tileA.prev).toEqual([tileB]);
        });

        it("Must completely clear the links in the absence of valid ones", () => {
            tileA.next = [tileB, tileC];
            tileB.prev = [tileA];
            tileC.prev = [tileA];

            tileA.left = 0;
            tileA.width = 40;
            tileB.left = 50;
            tileB.width = 50;
            tileC.left = 60;

            tileA["purgeInvalidLinks"](true);

            expect(tileA.next).toEqual([]);
            expect(tileB.prev).toEqual([]);
            expect(tileC.prev).toEqual([]);
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
});
