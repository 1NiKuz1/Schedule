import { defineComponent, computed, ref } from "vue";
import type { PropType } from "vue";

import { ScheduleHeaderTemplate } from "@features/ScheduleHeaderTemplate";
import { ScheduleDayTemplate } from "@features/ScheduleDayTemplate";
import { ScheduleWeekTemplate } from "@features/ScheduleWeekTemplate";
import { ScheduleMonthTemplate } from "@features/ScheduleMonthTemplate";
import { LinkAction } from "@shared/ui";
import type { IEvent } from "@shared/typings";

import "./ScheduleContainer.scss";

export default defineComponent({
    name: "ScheduleContainer",
    components: {
        ScheduleHeaderTemplate,
        ScheduleDayTemplate,
        ScheduleWeekTemplate,
        ScheduleMonthTemplate,
        LinkAction
    },
    props: {
        scheduleEvents: {
            type: Array as PropType<IEvent[]>,
            required: true
        },
        allowedDates: {
            type: Array as PropType<string[]>,
            required: true
        },
        componentsList: {
            type: Array as PropType<string[]>,
            required: true
        },
        rangeTypes: {
            type: Array as PropType<string[]>,
            required: true
        },
        currentTemplate: {
            type: String,
            required: true
        },
        startTypeOfRange: {
            type: String,
            required: true
        },
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    emits: ["update:start", "update:end", "on-click-schedule-event", "on-change-drop-down-list", "on-select-date", "on-click-scheduler"],
    setup(props, { emit }) {
        const eventGroups = ref<Map<string, number>>(new Map());

        const startDate = computed({
            get() {
                return props.start;
            },
            set(newValue) {
                emit("update:start", newValue);
            }
        });

        const endDate = computed({
            get() {
                return props.end;
            },
            set(newValue) {
                emit("update:end", newValue);
            }
        });

        function onClickScheduleEvent(event: IEvent): void {
            emit("on-click-schedule-event", event);
        }

        function onChangeDropDownList(typeOfRange: string): void {
            emit("on-change-drop-down-list", typeOfRange);
        }

        function onSelectDate(newDate: string): void {
            emit("on-select-date", newDate);
        }

        return {
            eventGroups,
            startDate,
            endDate,
            onClickScheduleEvent,
            onChangeDropDownList,
            onSelectDate
        };
    }
});
