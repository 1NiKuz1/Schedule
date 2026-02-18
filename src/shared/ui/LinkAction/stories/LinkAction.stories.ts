import type { Meta, StoryObj } from "@storybook/vue3-vite";
import LinkAction from "../LinkAction.vue";

const meta: Meta = {
    title: "ETLManager/Shared/LinkAction",
    component: LinkAction,
    render: () => ({
        components: {
            LinkAction
        },
        template: "<LinkAction>105</LinkAction>"
    })
} satisfies Meta<typeof LinkAction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const linkAction: Story = {};
