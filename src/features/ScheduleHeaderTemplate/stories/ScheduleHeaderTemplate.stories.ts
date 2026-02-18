import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleHeaderTemplate from "../ui/ScheduleHeaderTemplate.vue";
import { LinkAction } from "@shared/ui";
import { Tooltip } from "@shared/ui";

const meta = {
    title: "ETLManager/Features/ScheduleHeaderTemplate",
    component: ScheduleHeaderTemplate,
    render: args => ({
        components: {
            LinkAction,
            Tooltip,
            ScheduleHeaderTemplate
        },
        setup() {
            return { args };
        },
        data() {
            return {
                eventGroups: new Map([
                    ["service", 2],
                    ["system", 2]
                ]),
                startDate: "",
                endDate: ""
            };
        },
        methods: {
            handlerStartChanged(val: string, oldVal: string) {
                if (val !== oldVal) {
                    this.startDate = args.start;
                }
            },
            handlerEndChanged(val: string, oldVal: string) {
                if (val !== oldVal) {
                    this.endDate = args.end;
                }
            },
            onSelectDate(date: string) {
                console.log(date);
            },
            onChangeDropDownList(typeOfRange: string) {
                console.log(typeOfRange);
            }
        },
        watch: {
            start: "handlerStartChanged",
            end: "handlerEndChanged"
        },
        created() {
            this.startDate = args.start;
            this.endDate = args.end;
        },
        template: `<ScheduleHeaderTemplate
                        :allowedDates="args.allowedDates"
                        :rangeTypes="args.rangeTypes"
                        v-model:start="startDate"
                         v-model:end="endDate"
                        :startTypeOfRange="args.startTypeOfRange"
                        @on-change-drop-down-list="onChangeDropDownList"
                        @on-select-date="onSelectDate">
                    <span>slot</span>
                </ScheduleHeaderTemplate>`
    })
} satisfies Meta<typeof ScheduleHeaderTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const scheduleHeaderTemplate: Story = {
    name: "ScheduleHeaderTemplate",
    argTypes: {
        allowedDates: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Sorted array of dates"
        },
        rangeTypes: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Array of date ranges"
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
        },
        startTypeOfRange: {
            control: "text",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Initial range"
        }
    },
    args: {
        allowedDates: ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "2021-01-06", "2021-01-07"],
        rangeTypes: ["Day", "Week", "Month"],
        start: "2021-01-01",
        end: "2021-01-01",
        startTypeOfRange: "Day"
    }
};
