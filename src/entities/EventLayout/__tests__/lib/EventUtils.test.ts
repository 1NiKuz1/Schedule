import { describe, it, expect } from "vitest";
import { IEvent } from "@shared/typings";
import { EventUtils } from "../../lib";

describe("Entities/EventLayout/lib/EventUtils", () => {
    describe("getEventDescription", () => {
        it("It should return a string with a time range", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 11, 30)
            } as IEvent;

            expect(EventUtils.getEventDescription(event)).toBe("10:00 - 11:30");
        });

        it("It must correctly format the time at midnight", () => {
            const event = {
                start: new Date(2023, 0, 1, 0, 0),
                end: new Date(2023, 0, 1, 1, 0)
            } as IEvent;
            expect(EventUtils.getEventDescription(event)).toBe("00:00 - 01:00");
        });

        it("It should show the same time for the zero duration.", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 10, 0)
            } as IEvent;
            expect(EventUtils.getEventDescription(event)).toBe("10:00 - 10:00");
        });
    });

    describe("calcEventTop", () => {
        it("Must calculate the top position of the event", () => {
            const date = new Date(2023, 0, 1, 10, 30); // 10:30
            expect(EventUtils.calcEventTop(date)).toBe(714);
        });

        it("Must correctly calculate the position for midnight", () => {
            const midnight = new Date(2023, 0, 1, 0, 0);
            expect(EventUtils.calcEventTop(midnight)).toBe(0);
        });

        it("Must correctly calculate the position for one minute to midnight", () => {
            const midnight = new Date(2023, 0, 1, 23, 59);
            expect(EventUtils.calcEventTop(midnight)).toBe(1630.8666666666666);
        });

        it("It must correctly handle dates after midnight", () => {
            const date = new Date(2023, 0, 2, 0, 15);
            const expected = (0 * 60 + 15) * (68 / 60);
            expect(EventUtils.calcEventTop(date)).toBe(expected);
        });
    });

    describe("calcEventHeight", () => {
        it("Must calculate the height of the event", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 11, 0)
            } as IEvent;

            expect(EventUtils.calcEventHeight(event)).toBe(66);
        });

        it("It should return a positive value for very short events", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 10, 1)
            } as IEvent;

            const height = EventUtils.calcEventHeight(event);
            expect(height).toBeGreaterThanOrEqual(0);
        });

        it("Should return 0 for negative height", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 9, 0)
            } as IEvent;
            expect(EventUtils.calcEventHeight(event)).toBe(0);
        });

        it("Must correctly calculate a 24-hour event", () => {
            const event = {
                start: new Date(2023, 0, 1, 0, 0),
                end: new Date(2023, 0, 2, 0, 0)
            } as IEvent;
            const expected = 24 * 60 * (68 / 60) - 2;
            expect(EventUtils.calcEventHeight(event)).toBe(expected);
        });

        it("Must accurately calculate fractional height values", () => {
            const event = {
                start: new Date(2023, 0, 1, 10, 0),
                end: new Date(2023, 0, 1, 10, 45)
            } as IEvent;

            const expected = (45 * 68) / 60 - 2;
            expect(EventUtils.calcEventHeight(event)).toBeCloseTo(expected, 5);
        });
    });
});
