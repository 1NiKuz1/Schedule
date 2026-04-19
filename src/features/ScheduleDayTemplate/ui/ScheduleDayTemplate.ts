import { defineComponent, onMounted, onBeforeUnmount, onBeforeMount, computed, ref, watch } from "vue";
import type { PropType } from "vue";
import { TimeBlock } from "@shared/ui";
import { EventLayout } from "@entities/EventLayout";
import { Sizes } from "@shared/config";
import type { IEvent } from "@shared/typings";
import { resizeObserver, formatDateToString, adjustWidthToParentScroll, getElementAt } from "@shared/lib";
import { getCoveredHours, createDebounce } from "@shared/lib";
import "./ScheduleDayTemplate.scss";

export default defineComponent({
    name: "ScheduleDayTemplate",
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
            type: String
        }
    },
    emits: ["on-click-event"],
    setup(props, { emit }) {
        const ROW_HEIGHT_PX: string = Sizes.ROW_HEIGHT + "px";
        const scheduleDayTemplate = ref<HTMLElement | null>(null);
        /** TODO: This property is responsible for displaying all time lines,
         * and it may be necessary to add the ability to expand all lines in the future. */
        const isShowAllRows = ref<boolean>(false);
        const hours = ref<number[]>(Array.from({ length: 24 }, (c, i) => i));
        const { debouncedFunction: debouncedAdjustWidthToParentScroll, cancel } = createDebounce(adjustWidthToParentScroll, 500);

        const isToday = computed(() => {
            const today: Date = new Date(Date.now());
            return formatDateToString(today) === props.start;
        });

        function onClickEvent(event: IEvent): void {
            emit("on-click-event", event);
        }

        function isShowDots(index: number, hours: number[]): boolean {
            if (!index || !hours.length) {
                return false;
            }
            return getElementAt(hours, index) - getElementAt(hours, index - 1) > 1;
        }

        function prepareData(): void {
            hours.value = isShowAllRows.value ? Array.from({ length: 24 }, (c, i) => i) : getCoveredHours(props.events);
        }

        function handleResize(entry: ResizeObserverEntry): void {
            debouncedAdjustWidthToParentScroll(scheduleDayTemplate.value);
        }

        watch(
            () => props.events,
            () => {
                prepareData();
            },
            { deep: true }
        );

        onBeforeMount(() => {
            prepareData();
        });

        onMounted(() => {
            scheduleDayTemplate.value && resizeObserver.observe(scheduleDayTemplate.value, handleResize);
        });

        onBeforeUnmount(() => {
            scheduleDayTemplate.value && resizeObserver.unobserve(scheduleDayTemplate.value);
            cancel();
        });

        return {
            scheduleDayTemplate,
            ROW_HEIGHT_PX,
            isShowAllRows,
            hours,
            isShowDots,
            isToday,
            onClickEvent
        };
    }
});
