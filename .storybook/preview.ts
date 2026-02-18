import type { Preview } from "@storybook/vue3-vite";
import "../src/app/styles/main.scss";

const preview: Preview = {
    parameters: {
        controls: {
            expanded: true
        }
    }
};

export default preview;
