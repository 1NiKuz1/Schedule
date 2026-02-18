import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleContainer from "../ui/ScheduleContainer.vue";
import { formatDateToString, parseDate } from "@shared/lib";

const meta = {
    title: "ETLManager/Widgets/ScheduleContainer",
    component: ScheduleContainer,
    render: args => ({
        components: {
            ScheduleContainer
        },
        setup() {
            return { args };
        },
        data() {
            return {
                eventsValues: args.scheduleEvents,
                allowedDatesValues: args.allowedDates,
                currentTemplateValue: args.currentTemplate,
                startValue: args.start,
                endValue: args.end
            };
        },
        watch: {
            startValue: "onStartChanged",
            endValue: "onEndChanged"
        },
        methods: {
            onStartChanged(val: string, oldVal: string) {
                if (val === oldVal) {
                    return;
                }
                this.eventsValues = args.scheduleEvents.filter(
                    (event: any) => formatDateToString(event.start) >= this.startValue && formatDateToString(event.start) <= this.endValue
                );
            },
            onEndChanged(val: string, oldVal: string) {
                if (val === oldVal) {
                    return;
                }
                this.eventsValues = args.scheduleEvents.filter(
                    (event: any) => formatDateToString(event.start) >= this.startValue && formatDateToString(event.start) <= this.endValue
                );
            },
            changeRangeDates(typeOfRange: string, start: string) {
                this.startValue = start;
                const bufStartDate: Date = parseDate(this.startValue)!;
                switch (typeOfRange) {
                    case args.rangeTypes[0]:
                        this.currentTemplateValue = args.componentsList[0];
                        this.endValue = this.startValue;
                        break;
                    case args.rangeTypes[1]:
                        this.currentTemplateValue = args.componentsList[1];
                        bufStartDate.setDate(bufStartDate.getDate() + 6);
                        this.endValue = formatDateToString(bufStartDate);
                        break;
                    case args.rangeTypes[2]:
                        this.currentTemplateValue = args.componentsList[2];
                        bufStartDate.setDate(bufStartDate.getDate() + 34);
                        this.endValue = formatDateToString(bufStartDate);
                        break;
                }
            },
            onChangeDropDownList(typeOfRange: string) {
                this.changeRangeDates(typeOfRange, args.allowedDates[0]);
            },
            onSelectDate(event: any) {
                console.log(event);
                this.currentTemplateValue = args.componentsList[0];
            },
            onClickScheduleEvent(event: any) {
                console.log(event);
            },
            onClickScheduler() {
                console.log("onClickScheduler");
            },
            onClickEvents() {
                console.log("onClickEvents");
            },
            onClickEventGroup(eventGroup: any) {
                console.log(eventGroup);
            },
            onClickEvent(event: any) {
                console.log(event);
            }
        },
        template: `<ScheduleContainer 
                    :scheduleEvents="eventsValues"
                    :componentsList="args.componentsList"
                    :rangeTypes="args.rangeTypes"
                    :allowedDates="allowedDatesValues"
                    :currentTemplate="currentTemplateValue"
                    :startTypeOfRange="args.startTypeOfRange"
                    v-model:start="startValue"
                    v-model:end="endValue"
                    @on-change-drop-down-list="onChangeDropDownList"
                    @on-select-date="onSelectDate"
                    @on-click-schedule-event="onClickScheduleEvent"
                    @on-click-scheduler="onClickScheduler"
                    @on-click-events="onClickEvents"
                    @on-click-event-group="onClickEventGroup"
                    @on-click-event="onClickEvent"
                    />`
    })
} satisfies Meta<typeof ScheduleContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

const allowedDates: string[] = [];

function createEveryHoursEvents() {
    const start = new Date("2023-10-01T00:00");
    const end = new Date("2023-10-01T00:30");
    const events = [];
    const endPoint = new Date("2023-10-02T10:00");
    let counter = 0;
    for (let i = 0; i < 30; ++i) {
        allowedDates.push(formatDateToString(start));
        do {
            events.push({
                id: counter + "",
                start: new Date(start),
                end: new Date(end),
                title: "MeetingHours_" + counter,
                bgColorClass: "viz-color-back-1"
            });
            ++counter;
            start.setHours(start.getHours() + 1);
            end.setHours(end.getHours() + 1);
        } while (start.getDate() !== endPoint.getDate());
        endPoint.setDate(endPoint.getDate() + 1);
    }

    return events;
}

const everyHoursEvents = createEveryHoursEvents();

export const scheduleContainer: Story = {
    name: "ScheduleContainer",
    argTypes: {
        scheduleEvents: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Array of dispatch events"
        },
        componentsList: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Array of template components"
        },
        rangeTypes: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Array of date ranges"
        },
        allowedDates: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Array of available dates"
        },
        currentTemplate: {
            control: "text",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "The currently selected template"
        },
        startTypeOfRange: {
            control: "text",
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "The initial range of dates"
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
    },
    args: {
        scheduleEvents: everyHoursEvents,
        componentsList: ["ScheduleDayTemplate", "ScheduleWeekTemplate", "ScheduleMonthTemplate"],
        rangeTypes: ["Day", "Week", "Month"],
        allowedDates: allowedDates,
        currentTemplate: "ScheduleMonthTemplate",
        startTypeOfRange: "Month",
        start: "2023-10-01",
        end: "2023-11-04"
    }
};
