import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ScheduleDayTemplate from "../ui/ScheduleDayTemplate.vue";
import { manyDifferentEvents } from "./data";

const meta = {
    title: "ETLManager/Features/ScheduleDayTemplate",
    component: ScheduleDayTemplate,
    render: args => ({
        components: {
            ScheduleDayTemplate
        },
        setup() {
            return { args };
        },
        template: '<ScheduleDayTemplate :events="args.events" :start="args.start" />'
    })
} satisfies Meta<typeof ScheduleDayTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const scheduleDayTemplate: Story = {
    name: "ScheduleDayTemplate",
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
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Start date"
        }
    },
    args: {
        start: "2025-07-21",
        events: manyDifferentEvents
    }
};

let counter = 0;
const endPoint = new Date("2023-10-02T10:00");
const everyMinutesEvents = createEveryMinutesEvents();
const everyHoursEvents = createEveryHoursEvents();

export const scheduleDayTemplateEveryMinute: Story = {
    name: "ScheduleDayTemplate - Events every minute",
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
            type: { name: "string", required: true },
            table: {
                category: "Data"
            },
            description: "Start date"
        }
    },
    args: {
        start: "2025-07-21",
        events: [...everyMinutesEvents, ...everyHoursEvents]
    }
};

function createEveryMinutesEvents() {
    const start = new Date("2023-10-01T00:00");
    const end = new Date("2023-10-01T00:30");
    const events = [];
    do {
        events.push({
            id: counter + "",
            start: new Date(start),
            end: new Date(end),
            title: "MeetingMinutes_" + counter,
            bgColorClass: "viz-color-back-1"
        });
        ++counter;
        start.setMinutes(start.getMinutes() + 1);
        end.setMinutes(end.getMinutes() + 1);
    } while (start.getDate() !== endPoint.getDate());
    return events;
}

function createEveryHoursEvents() {
    const start = new Date("2023-10-01T00:00");
    const end = new Date("2023-10-01T00:30");
    const events = [];
    do {
        events.push({
            id: counter + "",
            start: new Date(start),
            end: new Date(end),
            title: "MeetingHours_" + counter,
            bgColorClass: "viz-color-back-2"
        });
        ++counter;
        start.setHours(start.getHours() + 1);
        end.setHours(end.getHours() + 1);
    } while (start.getDate() !== endPoint.getDate());
    return events;
}
