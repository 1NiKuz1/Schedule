import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScheduleBlockForTime from "../ScheduleBlockForTime.vue";

describe("Shared/ScheduleBlockForTime", () => {
    describe("Correct component generation", () => {
        it("Generating a component with passing valid passes", () => {
            const wrapper = mount(ScheduleBlockForTime, {
                propsData: { title: "Title", description: "test", minHeight: 32, height: 20, backgroundColor: "#fff" }
            });
            const component = wrapper.findComponent(ScheduleBlockForTime);
            expect(component.exists()).toBeTruthy();
        });
        it("Generating a component without passing passes", () => {
            const wrapper = mount(ScheduleBlockForTime);
            const component = wrapper.findComponent(ScheduleBlockForTime);
            expect(component.exists()).toBeTruthy();
        });
        it("Component generation (height is greater than the minimum height)", () => {
            const wrapper = mount(ScheduleBlockForTime, {
                propsData: { title: "Title", description: "test", minHeight: 32, height: 40, backgroundColor: "#fff" }
            });
            const component = wrapper.findComponent(ScheduleBlockForTime);
            expect(wrapper.find(".schedule-block-extension").exists()).toBe(false);
            expect(component.exists()).toBeTruthy();
        });
        it("Component generation (height is less than the minimum height)", () => {
            const wrapper = mount(ScheduleBlockForTime, {
                propsData: { title: "Title", description: "test", minHeight: 32, height: 20, backgroundColor: "#fff" }
            });
            const component = wrapper.findComponent(ScheduleBlockForTime);
            expect(wrapper.find(".schedule-block-extension").exists()).toBe(true);
            expect(component.exists()).toBeTruthy();
        });
    });
});
