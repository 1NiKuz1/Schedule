import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleWeekTemplate from "../ui/ScheduleWeekTemplate.vue";
import type { IEvent } from "@shared/typings";

const meta = {
    title: "ETLManager/Features/ScheduleWeekTemplate",
    component: ScheduleWeekTemplate,
    render: args => ({
        components: {
            ScheduleWeekTemplate
        },
        setup() {
            return { args };
        },
        methods: {
            onClickEvent(event: IEvent) {
                console.log(event);
            }
        },
        template: '<ScheduleWeekTemplate :events="args.events" :start="args.start" @on-click-event="onClickEvent" />'
    })
} satisfies Meta<typeof ScheduleWeekTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const scheduleWeekTemplate: Story = {
    name: "ScheduleWeekTemplate",
    argTypes: {
        events: {
            control: "object",
            type: { name: "string", required: true },
            table: {
                category: "Data"
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
                start: new Date("2023-10-01T00:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-01T01:00"),
                end: new Date("2023-10-01T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-02T01:00"),
                end: new Date("2023-10-02T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-03T01:00"),
                end: new Date("2023-10-03T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-04T01:00"),
                end: new Date("2023-10-04T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-05T01:00"),
                end: new Date("2023-10-05T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-06T01:00"),
                end: new Date("2023-10-06T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-07T01:00"),
                end: new Date("2023-10-07T02:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-07T05:00"),
                end: new Date("2023-10-07T08:00"),
                title: "Meeting"
            },
            {
                id: "1",
                start: new Date("2023-10-07T23:10"),
                end: new Date("2023-10-08T01:00"),
                title: "Meeting1"
            },
            {
                id: "1",
                start: new Date("2023-10-07T23:40"),
                end: new Date("2023-10-08T01:00"),
                title: "Meeting2"
            }
        ],
        start: "2023-10-01"
    }
};
