import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Tooltip from "../Tooltip.vue";

const meta = {
    title: "ETLManager/Shared/Tooltip",
    component: Tooltip,
    render: () => ({
        components: {
            Tooltip: Tooltip
        },
        template: `<div style="display: flex; flex-direction: column; height: 400px">
  <div style="display: flex; flex-wrap: wrap;  flex-grow: 1;">
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
  </div>
  <div style="display: flex; flex-wrap: wrap; flex-grow: 1">
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
  </div>
  <div style="display: flex; flex-wrap: wrap; flex-grow: 1">
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body> Learn more about this... </template>
    </Tooltip>
    <Tooltip style="flex-grow: 1; border: 1px solid blue;">
      <span>+</span>
      <template #body>
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      Learn more about this...
      </template>
    </Tooltip>
  </div>
</div>
`
    })
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const tooltip: Story = {};
