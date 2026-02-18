import { defineComponent, onMounted, onBeforeUnmount, computed, ref } from "vue";
import type { PropType } from "vue";
import { RangeDate } from "@entities/RangeDate";
import { DropDownList } from "@shared/ui";
import { adjustWidthToParentScroll, resizeObserver, createDebounce } from "@shared/lib";
import "./ScheduleHeaderTemplate.scss";

export default defineComponent({
    name: "ScheduleHeaderTemplate",
    components: { DropDownList, RangeDate },
    props: {
        allowedDates: {
            type: Array as PropType<string[]>,
            required: true
        },
        rangeTypes: {
            type: Array as PropType<string[]>,
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
    emits: ["update:start", "update:end", "on-change-drop-down-list", "on-select-date"],
    setup(props, { emit }) {
        const scheduleHeaderTemplate = ref<HTMLElement | null>(null);
        const selectedTypeOfRange = ref<string>(props.startTypeOfRange);
        const { debouncedFunction: debouncedAdjustWidthToParentScroll, cancel } = createDebounce(adjustWidthToParentScroll, 500);

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

        function onChangeDropDownList(typeOfRange): void {
            selectedTypeOfRange.value = typeOfRange;
            emit("on-change-drop-down-list", typeOfRange);
        }

        function onSelectDate(newDate: string): void {
            selectedTypeOfRange.value = props.rangeTypes[0]!;
            emit("on-select-date", newDate);
        }

        function handleResize(entry: ResizeObserverEntry): void {
            debouncedAdjustWidthToParentScroll(scheduleHeaderTemplate.value);
        }

        onMounted(() => {
            scheduleHeaderTemplate.value && resizeObserver.observe(scheduleHeaderTemplate.value, handleResize);
        });

        onBeforeUnmount(() => {
            scheduleHeaderTemplate.value && resizeObserver.unobserve(scheduleHeaderTemplate.value);
            cancel();
        });

        return {
            scheduleHeaderTemplate,
            startDate,
            endDate,
            selectedTypeOfRange,
            onSelectDate,
            onChangeDropDownList
        };
    }
});
