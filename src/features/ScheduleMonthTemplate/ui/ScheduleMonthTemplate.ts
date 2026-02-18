import { defineComponent, onMounted, ref, watch, onBeforeUnmount } from "vue";
import type { PropType } from "vue";
import { ScheduleBlock, EventsList, Tooltip, OvalText } from "@shared/ui";
import { EventUtils } from "@entities/EventLayout";
import type { IEvent } from "@shared/typings";
import { Sizes } from "@shared/config";
import { adjustWidthToParentScroll, formatDateToString, parseDate, resizeObserver, createDebounce } from "@shared/lib";
import { COUNT_DAY_OF_TEMPLATE } from "../config";
import "./ScheduleMonthTemplate.scss";

interface IDayOfMonth {
    date: Date;
    events: IEvent[];
    hiddenEvents: IEvent[];
}

export default defineComponent({
    name: "ScheduleMonthTemplate",
    components: {
        ScheduleBlock,
        Tooltip,
        OvalText,
        EventsList
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
        const scheduleMonthTemplate = ref<HTMLElement | null>(null);
        const INDENT_SCHEDULE_BLOCK: number = Sizes.INDENT_SCHEDULE_BLOCK;
        const HEIGHT_SCHEDULE_BLOCK: number = 25;
        const MAX_COUNT_OF_VISIBLE_TILES: number = 4;
        const visibleDayNamesMin = ref<string[]>([]);
        const visibleEvents = ref<IDayOfMonth[][]>([]);
        const dayNamesMin: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let eventsOfMonth: Map<string, IDayOfMonth> = new Map();
        const { debouncedFunction: debouncedAdjustWidthToParentScroll, cancel } = createDebounce(adjustWidthToParentScroll, 500);

        function onClickEvent(event: IEvent): void {
            emit("on-click-event", event);
        }

        function formatEventTimeRange(event: IEvent): string {
            return EventUtils.getEventDescription(event);
        }

        function isToday(date: Date): boolean {
            const today: Date = new Date(Date.now());
            return formatDateToString(date) === formatDateToString(today);
        }

        function prepareData(): void {
            visibleDayNamesMin.value = [];
            visibleEvents.value = [];
            eventsOfMonth = new Map();
            const start: Date = parseDate(props.start)!;
            visibleDayNamesMin.value = [...dayNamesMin.slice(start.getDay()), ...dayNamesMin.slice(0, start.getDay())];
            for (let i = 0; i < COUNT_DAY_OF_TEMPLATE; ++i) {
                eventsOfMonth.set(formatDateToString(start), { date: new Date(start), events: [], hiddenEvents: [] });
                start.setDate(start.getDate() + 1);
            }
            for (const event of props.events) {
                const key: string = formatDateToString(event.start);
                const eventsByKey: IDayOfMonth = eventsOfMonth.get(key)!;
                if (eventsByKey) {
                    if (eventsByKey.events.length < MAX_COUNT_OF_VISIBLE_TILES) {
                        eventsByKey.events.push(event);
                        continue;
                    }
                    eventsByKey.hiddenEvents.push(event);
                }
            }
            let numOfRow = 0;
            for (const eventsOfDay of eventsOfMonth.values()) {
                visibleEvents.value[numOfRow] = !visibleEvents.value[numOfRow] ? [] : visibleEvents.value[numOfRow]!;
                visibleEvents.value[numOfRow]!.push(eventsOfDay);
                const daysOfWeek: number = 7;
                if (visibleEvents.value[numOfRow]!.length === daysOfWeek) {
                    ++numOfRow;
                }
            }
        }

        function handleResize(entry: ResizeObserverEntry): void {
            debouncedAdjustWidthToParentScroll(scheduleMonthTemplate.value);
        }

        watch(
            () => props.events,
            () => {
                prepareData();
            },
            { deep: true, immediate: true }
        );

        onMounted(() => {
            scheduleMonthTemplate.value && resizeObserver.observe(scheduleMonthTemplate.value, handleResize);
        });

        onBeforeUnmount(() => {
            scheduleMonthTemplate.value && resizeObserver.unobserve(scheduleMonthTemplate.value);
            cancel();
        });

        return {
            scheduleMonthTemplate,
            visibleDayNamesMin,
            visibleEvents,
            INDENT_SCHEDULE_BLOCK,
            HEIGHT_SCHEDULE_BLOCK,
            MAX_COUNT_OF_VISIBLE_TILES,
            formatEventTimeRange,
            isToday,
            onClickEvent
        };
    }
});
