import type { Meta, StoryObj } from "@storybook/vue3-vite";
import DropDownList from "../DropDownList.vue";

const meta = {
    title: "ETLManager/Shared/DropDownList",
    component: DropDownList,
    render: args => ({
        components: {
            DropDownList
        },
        setup() {
            return { args };
        },
        data() {
            return {
                localSelectedItem: args.selectedItem
            };
        },
        template: `<DropDownList
                :selectedItem="localSelectedItem"
                :dropDownList="args.dropDownList"
                :isAlignLeft="args.isAlignLeft"
                @on-change="(newVal) => localSelectedItem = newVal" />`
    })
} satisfies Meta<typeof DropDownList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const dropDownList: Story = {
    name: "DropDownList",
    args: {
        dropDownList: ["Day", "Week", "Month"],
        isAlignLeft: true,
        selectedItem: "Day"
    },
    argTypes: {
        dropDownList: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "An array of values for the drop-down list"
        },
        isAlignLeft: {
            control: "boolean",
            table: {
                category: "Positioning",
                defaultValue: {
                    summary: "false"
                }
            },
            description: "Left-aligned list of items"
        },
        selectedItem: {
            control: "text",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "The current selected item"
        }
    }
};
