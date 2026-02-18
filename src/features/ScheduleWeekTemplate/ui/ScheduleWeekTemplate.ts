import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from "vue";
import type { PropType } from "vue";
import { TimeBlock } from "@shared/ui";
import { EventLayout } from "@entities/EventLayout";
import { resizeObserver, formatDateToString, parseDate, adjustWidthToParentScroll, createDebounce, getCoveredHours } from "@shared/lib";
import type { IEvent } from "@shared/typings";
import { Sizes } from "@shared/config";
import { COUNT_DAY_OF_TEMPLATE } from "../config";
import "./ScheduleWeekTemplate.scss";

export default defineComponent({
    name: "ScheduleMonthTemplate",
    components: {
        TimeBlock,
        EventLayout
    },
    props: {
        events: {
            type: Array as PropType<IEvent[]>,
            required: true
        },
        start: {
            type: String,
            required: true
        }
    },
    emits: ["on-click-event"],
    setup(props, { emit }) {
        const ROW_HEIGHT_PX: string = Sizes.ROW_HEIGHT + "px";
        const scheduleWeekTemplate = ref<HTMLElement | null>(null);
        const weekEvents = ref<Map<string, IEvent[]>>(new Map());
        /** TODO: This property is responsible for displaying all time lines,
         * and it may be necessary to add the ability to expand all lines in the future. */
        const isShowAllRows = ref<boolean>(false);
        const dayNamesMin: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ref<number[]>(Array.from({ length: 24 }, (c, i) => i));
        const { debouncedFunction: debouncedAdjustWidthToParentScroll, cancel } = createDebounce(adjustWidthToParentScroll, 500);

        function onClickEvent(event: IEvent) {
            emit("on-click-event", event);
        }

        function isShowDots(index: number, hours: number[]): boolean {
            if (!index) {
                return false;
            }
            return hours[index]! - hours[index - 1]! > 1;
        }

        function isToday(date: string): boolean {
            const today: Date = new Date(Date.now());
            return formatDateToString(today) === date;
        }

        function prepareData(): void {
            weekEvents.value = new Map();
            const start: Date = parseDate(props.start)!;
            for (let i = 0; i < COUNT_DAY_OF_TEMPLATE; ++i) {
                weekEvents.value.set(formatDateToString(start), []);
                start.setDate(start.getDate() + 1);
            }
            for (const event of props.events) {
                const key: string = formatDateToString(event.start);
                const dayEvents: IEvent[] = weekEvents.value.get(key)!;
                if (dayEvents) {
                    dayEvents.push(event);
                }
            }
            hours.value = isShowAllRows.value ? Array.from({ length: 24 }, (c, i) => i) : getCoveredHours(props.events);
        }

        function handleResize(entry: ResizeObserverEntry): void {
            debouncedAdjustWidthToParentScroll(scheduleWeekTemplate.value);
        }

        watch(
            () => props.events,
            () => {
                prepareData();
            },
            { deep: true, immediate: true }
        );

        onMounted(() => {
            scheduleWeekTemplate.value && resizeObserver.observe(scheduleWeekTemplate.value, handleResize);
        });

        onBeforeUnmount(() => {
            scheduleWeekTemplate.value && resizeObserver.unobserve(scheduleWeekTemplate.value);
            cancel();
        });

        return {
            scheduleWeekTemplate,
            weekEvents,
            dayNamesMin,
            hours,
            isShowAllRows,
            ROW_HEIGHT_PX,
            parseDate,
            isShowDots,
            isToday,
            onClickEvent
        };
    }
});
