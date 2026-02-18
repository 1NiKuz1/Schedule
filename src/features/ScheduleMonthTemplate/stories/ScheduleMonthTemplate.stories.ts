import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleMonthTemplate from "../ui/ScheduleMonthTemplate.vue";
import { formatDateToString } from "@shared/lib";
import type { IEvent } from "@shared/typings";

const meta = {
    title: "ETLManager/Features/ScheduleMonthTemplate",
    component: ScheduleMonthTemplate,
    render: args => ({
        components: {
            ScheduleMonthTemplate
        },
        setup() {
            return { args };
        },
        methods: {
            onClickEvent(event: IEvent) {
                console.log(event);
            }
        },
        template: '<ScheduleMonthTemplate :events="args.events" :start="args.start" @on-click-event="onClickEvent" />'
    })
} satisfies Meta<typeof ScheduleMonthTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

const today: Date = new Date(Date.now());
const tommorow: Date = new Date(today);
tommorow.setDate(tommorow.getDate() + 1);

export const scheduleMonthTemplate: Story = {
    name: "ScheduleMonthTemplate",
    argTypes: {
        events: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Date"
            },
            description: "Events array"
        },
        start: {
            control: "text",
            table: {
                category: "Main"
            },
            description: "Start date"
        }
    },
    args: {
        events: [
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(today.setHours(1)),
                end: new Date(today.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(tommorow.setHours(1)),
                end: new Date(tommorow.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(tommorow.setHours(1)),
                end: new Date(tommorow.setHours(2)),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date(tommorow.setHours(1)),
                end: new Date(tommorow.setHours(2)),
                title: "MeetingMeetingMeetingMeetingMeetingMeetingMeetingMeetingMeetingMeeting"
            }
        ],
        start: formatDateToString(today)
    }
};
