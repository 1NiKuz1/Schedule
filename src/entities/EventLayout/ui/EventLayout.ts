import { defineComponent, onMounted, onBeforeUnmount, onBeforeMount, ref, watch } from "vue";
import type { PropType } from "vue";

import { ScheduleBlockForTime, EventsList, Tooltip, OvalText, TimeBlock } from "@shared/ui";
import type { IEvent, IVerticalBoundaries } from "@shared/typings";
import { Sizes } from "@shared/config";
import { resizeObserver, createDebounce } from "@shared/lib";
import { EventLayoutModel } from "../model";
import { ButtonWidthCalculator, EventUtils } from "../lib";
import type { ITileLine, ITile } from "../model/typings";
import "./EventLayout.scss";

export default defineComponent({
    name: "EventLayout",
    components: {
        TimeBlock,
        ScheduleBlockForTime,
        Tooltip,
        OvalText,
        EventsList
    },
    props: {
        events: {
            type: Array as PropType<IEvent[]>,
            required: true
        },
        hours: {
            type: Array as PropType<number[]>,
            default: []
        },
        isToday: {
            type: Boolean
        },
        isShowAllRows: {
            type: Boolean
        }
    },
    emits: ["on-click-event"],
    setup(props, { emit }) {
        const MIN_HEIGHT_SCHEDULE_BLOCK: number = Sizes.MIN_HEIGHT_SCHEDULE_BLOCK;
        const scheduleEvents = ref<HTMLElement | null>(null);
        const buttonWidth = ref<number>(0); // The width of the button as a percentage
        const lines = ref<ITileLine[]>([]);
        const eventLayout = ref<EventLayoutModel | null>(null);
        let sortedEvents: IEvent[];
        const { debouncedFunction: debouncedPrepareData, cancel } = createDebounce(prepareData, 500);

        const step = Sizes.ROW_HEIGHT / 2; // The height of one half-hour interval
        const lineStyles = {
            backgroundImage: `repeating-linear-gradient(
                    transparent,
                    transparent ${step - 1}px,
                    var(--color-tool-border),
                    var(--color-tool-border) ${step}px
                )`
        };

        function onClickEvent(event: IEvent): void {
            emit("on-click-event", event);
        }

        function getTilesPosition(tile: ITile) {
            return {
                top: `${tile.top - getHideSpace(tile)}px`,
                left: `${tile.left}%`,
                width: `calc(${tile.width}% - ${Sizes.INDENT_SCHEDULE_BLOCK}px)`
            };
        }

        function getTooltipPosition(key: IVerticalBoundaries, buttonWidth: number) {
            return {
                top: `${key.top - getHideSpace(key)}px`,
                left: `${100 - buttonWidth}%`,
                width: buttonWidth + "%"
            };
        }

        function getHideSpace(target: IVerticalBoundaries): number {
            const hour: number = Math.trunc(target.top / Sizes.ROW_HEIGHT);
            const index: number = props.hours.indexOf(hour);
            const length: number = props.hours.slice(0, index).length;
            return (hour - length) * Sizes.ROW_HEIGHT;
        }

        function getTileHeight(tile: ITile): number {
            return tile.bottom > Sizes.ROW_HEIGHT * 24
                ? tile.height - (tile.bottom - Sizes.ROW_HEIGHT * 24) - Sizes.INDENT_SCHEDULE_BLOCK * 2
                : tile.height;
        }

        function prepareData(): void {
            if (scheduleEvents.value) {
                eventLayout.value = new EventLayoutModel(sortedEvents, scheduleEvents.value.clientWidth);
                buttonWidth.value = ButtonWidthCalculator.calculate(scheduleEvents.value.clientWidth);
                lines.value = eventLayout.value.lines;
            }
        }

        function handleResize(entry: ResizeObserverEntry): void {
            debouncedPrepareData();
        }

        watch(
            () => props.events,
            () => {
                sortedEvents = [...props.events].sort((a, b) => a.start.getTime() - b.start.getTime());
                prepareData();
            },
            { deep: true }
        );

        onBeforeMount(() => {
            sortedEvents = [...props.events].sort((a, b) => a.start.getTime() - b.start.getTime());
        });

        onMounted(() => {
            scheduleEvents.value && resizeObserver.observe(scheduleEvents.value, handleResize);
        });

        onBeforeUnmount(() => {
            scheduleEvents.value && resizeObserver.unobserve(scheduleEvents.value);
            cancel();
        });

        return {
            scheduleEvents,
            lineStyles,
            lines,
            buttonWidth,
            eventLayout,
            MIN_HEIGHT_SCHEDULE_BLOCK,
            getTilesPosition,
            getTooltipPosition,
            getTileHeight,
            formatEventTimeRange: EventUtils.getEventDescription,
            onClickEvent
        };
    }
});
