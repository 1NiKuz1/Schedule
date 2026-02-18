import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleBlockForTime from "../ScheduleBlockForTime.vue";
import { argTypes } from "./docs";

const meta = {
    title: "ETLManager/Shared/ScheduleBlockForTime",
    component: ScheduleBlockForTime,
    render: args => ({
        components: {
            ScheduleBlockForTime
        },
        setup() {
            return { args };
        },
        template: `<ScheduleBlockForTime 
            :title="args.title" 
            :description="args.description" 
            :height="args.height" 
            :minHeight="args.minHeight" 
            :bgColorClass="args.bgColorClass" />`
    })
} satisfies Meta<typeof ScheduleBlockForTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const scheduleBlockForTime: Story = {
    name: "ScheduleBlockForTime - The block height is less than the minimum height",
    args: {
        title: "EPBS_EIAS_0001_L",
        description: "00:00-00:00",
        height: 12,
        minHeight: 32,
        bgColorClass: "viz-color-back-2"
    },
    argTypes
};

export const scheduleBlockForTime2: Story = {
    name: "ScheduleBlockForTime - The block height is greater than the minimum height",
    args: {
        title: "EPBS_EIAS_0001_L",
        description: "00:00-00:00",
        height: 40,
        minHeight: 32,
        bgColorClass: "viz-color-back-2"
    },
    argTypes
};

export const scheduleBlockForTimeWithoutProps: Story = {
    name: "ScheduleBlockForTime - Without props",
    argTypes
};
