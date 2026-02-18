import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RangeDate from "../ui/RangeDate.vue";

beforeEach(() => {
    const container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
});
afterEach(() => {
    const container = document.getElementById("root");
    if (container) {
        document.body.removeChild(container);
    }
});
describe("Entities/RangeDate", () => {
    const baseDates = ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "2021-01-06", "2021-01-07", "2021-01-08"];
    const createWrapper = (props = {}) =>
        mount(RangeDate, {
            propsData: {
                allowedDates: [...baseDates],
                start: "2021-01-03",
                end: "2021-01-05",
                ...props
            },
            attachTo: "#root"
        });

    describe("Basic behavior", () => {
        it("Correct initialization of the component", () => {
            const wrapper = createWrapper();
            expect(wrapper.exists()).toBeTruthy();
        });

        it("Displaying the correct date format", () => {
            const wrapper = createWrapper();
            expect(wrapper.vm["visibleDate"]).toBe("3 Jun - 5 Jun 2021");
        });

        it("A single date is formatted correctly", async () => {
            const wrapper = createWrapper({ start: "2021-01-03", end: "2021-01-03" });
            expect(wrapper.vm["visibleDate"]).toBe("3 January 2021");
        });
    });

    describe("Validation of passes", () => {
        it.skip("An empty allowedDates causes an error", () => {
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            createWrapper({ start: "invalid-date" });

            expect(consoleSpy).toHaveBeenCalled();
            expect(consoleSpy.mock.calls[0][0]).toContain("Invalid prop");
            consoleSpy.mockRestore();
        });
        it.skip("Incorrect date format causes an error", () => {
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            createWrapper({
                allowedDates: ["2021-01-01", "invalid-date", "2021-01-02"]
            });

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("The logic of date validation", () => {
        it("The start date is larger than the end date - the dates are reversed", async () => {
            const wrapper = createWrapper({ start: "2021-01-05", end: "2021-01-03" });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted("update:start")).toEqual([["2021-01-03"]]);
            expect(wrapper.emitted("update:end")).toEqual([["2021-01-05"]]);
        });
    });

    describe("Range shifting Logic", () => {
        it("Shift to the right within the boundaries", async () => {
            const wrapper = createWrapper();
            await wrapper.findAllComponents({ name: "FontIcon" })[1].trigger("click");
            expect(wrapper.emitted("update:start")).toEqual([["2021-01-05"]]);
            expect(wrapper.emitted("update:end")).toEqual([["2021-01-07"]]);
        });

        it("Shift to the left within the boundaries", async () => {
            const wrapper = createWrapper();
            await wrapper.findAllComponents({ name: "FontIcon" }).at(0).trigger("click");
            expect(wrapper.emitted("update:start")).toEqual([["2021-01-01"]]);
            expect(wrapper.emitted("update:end")).toEqual([["2021-01-03"]]);
        });

        it("The shift beyond the left boundary", async () => {
            const wrapper = createWrapper({ start: "2021-01-02", end: "2021-01-04" });
            await wrapper.findAllComponents({ name: "FontIcon" })[0].trigger("click");
            expect(wrapper.emitted("update:start")).toEqual([["2020-12-31"]]);
            expect(wrapper.emitted("update:end")).toEqual([["2021-01-02"]]);
        });

        it("Shifting beyond the right boundary", async () => {
            const wrapper = createWrapper({
                start: "2021-01-05",
                end: "2021-01-07"
            });

            await wrapper.findAllComponents({ name: "FontIcon" })[1].trigger("click");
            expect(wrapper.emitted("update:start")).toEqual([["2021-01-07"]]);
            expect(wrapper.emitted("update:end")).toEqual([["2021-01-09"]]);
        });
    });

    describe("Working with VCalendar", () => {
        it("Opening/closing a picker", async () => {
            const wrapper = createWrapper();
            await wrapper.find(".range-date__visible-date").trigger("click");

            expect(wrapper.vm["isShowDatePicker"]).toBe(true);

            await wrapper.find(".range-date__visible-date").trigger("click");

            expect(wrapper.vm["isShowDatePicker"]).toBe(false);
        });

        it("Selecting a date in the picker sets both dates", async () => {
            const wrapper = createWrapper();

            wrapper.vm["onSelectDate"]("2021-01-04");
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted("update:start")).toEqual([["2021-01-04"]]);
            expect(wrapper.emitted("update:end")).toEqual([["2021-01-04"]]);
        });

        it("Clicking outside the component closes the picker", async () => {
            const wrapper = createWrapper();

            wrapper.vm["isShowDatePicker"] = true;
            document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            await wrapper.vm.$nextTick();

            expect(wrapper.vm["isShowDatePicker"]).toBe(false);
        });
    });

    describe("Boundary conditions", () => {
        it("Disabling the left arrow on the left border", async () => {
            const wrapper = createWrapper({ start: "2021-01-01", end: "2021-01-01" });

            expect(wrapper.vm["isDisableLeftArrow"]).toBe(true);
            const leftArrow = wrapper.findAllComponents({ name: "FontIcon" })[0];
            expect(leftArrow.props("disabled")).toBe(true);
            expect(leftArrow.classes()).toContain("ui-font-icon--disabled");
        });

        it("Disabling the right arrow on the right border", async () => {
            const wrapper = createWrapper({ start: "2021-01-08", end: "2021-01-08" });

            expect(wrapper.vm["isDisableRightArrow"]).toBe(true);
            const rightArrow = wrapper.findAllComponents({ name: "FontIcon" })[1];
            expect(rightArrow.props("disabled")).toBe(true);
            expect(rightArrow.classes()).toContain("ui-font-icon--disabled");
        });
    });
});
