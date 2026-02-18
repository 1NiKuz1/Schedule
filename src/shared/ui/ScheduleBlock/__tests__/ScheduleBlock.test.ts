import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScheduleBlock from "../ScheduleBlock.vue";

describe("Shared/ScheduleBlock", () => {
    describe("Correct component generation", () => {
        it("Generating a component with passing valid passes", () => {
            const wrapper = mount(ScheduleBlock, {
                propsData: { title: "title", description: "description", height: "20px", backgroundColor: "#fff" }
            });
            const component = wrapper.findComponent(ScheduleBlock);
            expect(component.exists()).toBeTruthy();
        });
        it("Generating a component without passing passes", () => {
            const wrapper = mount(ScheduleBlock);
            const component = wrapper.findComponent(ScheduleBlock);
            expect(component.exists()).toBeTruthy();
        });
    });
});
