import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RangeDate from "../ui/RangeDate.vue";

const meta = {
    title: "ETLManager/Entities/RangeDate",
    component: RangeDate,
    render: (args: any) => ({
        components: {
            RangeDate
        },
        setup() {
            return { args };
        },
        data() {
            return {
                localStart: args.start,
                localEnd: args.end
            };
        },
        methods: {
            onSelectDate(newVal: string) {
                console.log(newVal);
            }
        },
        watch: {
            localStart(newVal) {
                this.localStart = newVal;
                console.log(newVal);
            },
            localEnd(newVal) {
                this.localEnd = newVal;
                console.log(newVal);
            }
        },
        template: `<RangeDate 
                    :allowedDates="args.allowedDates" 
                    v-model:start="localStart"
                    v-model:end="localEnd"
                    @on-select-date="onSelectDate"/>`
    })
} satisfies Meta<typeof RangeDate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const rangeDate: Story = {
    name: "RangeDate",
    args: {
        allowedDates: ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "2021-01-06", "2021-01-07"],
        start: "2021-01-01",
        end: "2021-01-01"
    },
    argTypes: {
        allowedDates: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Sorted array of dates"
        },
        start: {
            control: "text",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Start date"
        },
        end: {
            control: "text",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "End date"
        }
    }
};
