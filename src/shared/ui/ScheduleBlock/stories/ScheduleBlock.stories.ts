import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleBlock from "../ScheduleBlock.vue";
import { argTypes } from "./docs";

const meta: Meta<typeof ScheduleBlock> = {
    title: "ETLManager/Shared/ScheduleBlock",
    component: ScheduleBlock,
    render: args => ({
        components: {
            ScheduleBlock
        },
        setup() {
            return { args };
        },
        template:
            '<ScheduleBlock :title="args.title" :description="args.description" :height="args.height" :bgColorClass="args.bgColorClass" />'
    })
} satisfies Meta<typeof ScheduleBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const scheduleBlock: Story = {
    name: "ScheduleBlock",
    argTypes,
    args: {
        title: "EPBS_EIAS_0001_L",
        description: "00:00-00:00",
        height: "32px",
        bgColorClass: "viz-color-back-2"
    }
};

export const scheduleBlockWihtoutProps: Story = {
    name: "ScheduleBlock - Without props",
    argTypes
};
