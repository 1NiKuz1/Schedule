import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import DropDownList from "../DropDownList.vue";

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

describe("Shared/DropDownList", () => {
    const createWrapper = (props = {}) =>
        mount(DropDownList, {
            propsData: {
                dropDownList: ["Day", "Week", "Month"],
                isAlignLeft: true,
                selectedItem: "Day",
                ...props
            },
            attachTo: "#root"
        });
    describe("Correct component generation", () => {
        it("Generating a component with passing valid passes", () => {
            const wrapper = createWrapper();
            const component = wrapper.findComponent(DropDownList);
            expect(component.exists()).toBeTruthy();
        });
        it("Generating a component with the list of elements aligned to the left", () => {
            const wrapper = createWrapper();
            const component = wrapper.findComponent(DropDownList);
            expect(component.exists()).toBeTruthy();
            expect(component.find(".drop-down-list__items--align-left").exists()).toBeTruthy();
        });
    });
    describe("Processing component events", () => {
        it("Opening the drop-down list", async () => {
            const wrapper = createWrapper();
            await wrapper.find(".drop-down-list__content-wrapper").trigger("click");

            expect(wrapper.vm["isShowDropDownList"]).toEqual(true);
        });
        it("Closing the drop-down list (By clicking on the selected item)", async () => {
            const wrapper = createWrapper();

            wrapper.vm["isShowDropDownList"] = true;
            await wrapper.find(".drop-down-list__content-wrapper").trigger("click");

            expect(wrapper.vm["isShowDropDownList"]).toEqual(false);
        });
        it("Closing the drop-down list (By clicking on the list item)", async () => {
            const wrapper = createWrapper();
            await wrapper.find(".drop-down-list__content-wrapper").trigger("click");
            await wrapper.find(".drop-down-list__item").trigger("click");

            expect(wrapper.vm["isShowDropDownList"]).toEqual(false);
        });
        it("Closing the drop-down list (When clicking past the component)", async () => {
            const wrapper = createWrapper();

            wrapper.vm["isShowDropDownList"] = true;
            document.body.dispatchEvent(new Event("click", { bubbles: true }));

            expect(wrapper.vm["isShowDropDownList"]).toEqual(false);
        });
        it("Changing the currently selected item when selecting another item in the list", async () => {
            const wrapper = createWrapper();
            wrapper.findAll(".drop-down-list__item").at(1).trigger("click");
            expect(wrapper.emitted("on-change")[0][0]).toEqual("Week");
        });
    });
});
