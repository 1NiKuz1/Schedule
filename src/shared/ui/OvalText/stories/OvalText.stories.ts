import type { Meta, StoryObj } from "@storybook/vue3-vite";
import OvalText from "../OvalText.vue";

const meta: Meta = {
    title: "ETLManager/Shared/OvalText",
    component: OvalText,
    render: () => ({
        components: {
            OvalText
        },
        template: "<OvalText>+23</OvalText>"
    })
} satisfies Meta<typeof OvalText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ovalText: Story = {};
