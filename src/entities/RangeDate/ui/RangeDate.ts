import { defineComponent, onMounted, onBeforeUnmount, computed, ref, watch } from "vue";
import type { PropType } from "vue";

import { formatDateToString, parseDate, getMonthName } from "@shared/lib";
import { FontIcon } from "@shared/ui";
import { VCalendar } from "@entities/VCalendar/@x/RangeDate";

import "./RangeDate.scss";

export default defineComponent({
    name: "RangeDate",
    components: {
        FontIcon,
        VCalendar
    },
    props: {
        allowedDates: {
            type: Array as PropType<string[]>,
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
    emits: ["update:start", "update:end", "on-select-date"],
    setup(props, { emit }) {
        const MS_PER_DAY: number = 86_400_000;
        const visibleDate = ref<string>("");
        const isShowDatePicker = ref<boolean>(false);

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

        const currentDate = computed(() => parseDate(startDate.value)!);
        const leftLimitOfRange = computed(() => props.allowedDates[0]!);
        const rightLimitOfRange = computed(() => props.allowedDates[props.allowedDates.length - 1]!);
        const isDisableLeftArrow = computed(() => leftLimitOfRange.value >= startDate.value);
        const isDisableRightArrow = computed(() => rightLimitOfRange.value <= endDate.value);

        const stepOfRange = computed(() => {
            if (endDate.value === startDate.value) {
                return 1;
            }
            return (parseDate(endDate.value)!.getTime() - parseDate(startDate.value)!.getTime()) / MS_PER_DAY;
        });

        function onSelectDate(newDate: string): void {
            isShowDatePicker.value = false;
            startDate.value = endDate.value = newDate;
            emit("on-select-date", newDate);
        }

        function onClickVisibleDate(): void {
            isShowDatePicker.value = !isShowDatePicker.value;
        }

        function onClickLeftArrow(): void {
            if (isDisableLeftArrow.value) {
                return;
            }
            shiftDateByStep(endDate.value, changeEndDate, -stepOfRange.value);
            shiftDateByStep(startDate.value, changeStartDate, -stepOfRange.value);
        }

        function onClickRightArrow(): void {
            if (isDisableRightArrow.value) {
                return;
            }
            shiftDateByStep(startDate.value, changeStartDate, stepOfRange.value);
            shiftDateByStep(endDate.value, changeEndDate, stepOfRange.value);
        }

        function changeStartDate(newValue: string): void {
            if (startDate.value !== newValue) {
                startDate.value = newValue;
            }
        }

        function changeEndDate(newValue: string): void {
            if (endDate.value !== newValue) {
                endDate.value = newValue;
            }
        }

        function shiftDateByStep(date: string, callBack: (val: string) => void, step: number): void {
            const newDate: Date = parseDate(date)!;
            newDate.setDate(newDate.getDate() + step);
            callBack(formatDateToString(newDate));
        }

        function formatDateRange(): void {
            const newStartDate: Date = parseDate(startDate.value)!;
            if (startDate.value === endDate.value) {
                visibleDate.value = formatDate(newStartDate, false, true);
                return;
            }
            const newEndDate: Date = parseDate(endDate.value)!;
            const startYear: number = newStartDate.getFullYear();
            const endYear: number = newEndDate.getFullYear();
            if (startYear === endYear) {
                visibleDate.value = `${formatDate(newStartDate, true, false)} - ${formatDate(newEndDate, true, false)} ${startYear}`;
                return;
            }
            visibleDate.value = `${formatDate(newStartDate, true, true)} - ${formatDate(newEndDate, true, true)}`;
        }

        function formatDate(date: Date, shortMonth: boolean, showYear: boolean): string {
            const day: number = date.getDate();
            const month: string = getMonthName(date, shortMonth)!;
            return `${day} ${month}${showYear ? ` ${date.getFullYear()}` : ""}`;
        }

        function validateDates(): void {
            if (startDate.value > endDate.value) {
                changeStartDate(endDate.value);
                changeEndDate(startDate.value);
            }
        }

        function handleClickOutside(event: any): void {
            if (!event.target.closest(".range-date__visible-date")) {
                isShowDatePicker.value = false;
            }
        }

        watch([startDate, endDate], ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
            if (newStartDate !== oldStartDate || newEndDate !== oldEndDate) {
                validateDates();
                formatDateRange();
            }
        });

        onMounted(() => {
            formatDateRange();
            validateDates();
            document.addEventListener("click", handleClickOutside);
        });

        onBeforeUnmount(() => {
            document.removeEventListener("click", handleClickOutside);
        });

        return {
            currentDate,
            isShowDatePicker,
            isDisableLeftArrow,
            isDisableRightArrow,
            visibleDate,
            getMonthName,
            parseDate,
            onSelectDate,
            onClickVisibleDate,
            onClickLeftArrow,
            onClickRightArrow
        };
    }
});
