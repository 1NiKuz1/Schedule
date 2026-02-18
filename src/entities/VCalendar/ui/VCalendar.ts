import { computed, defineComponent, onMounted, ref } from "vue";
import type { ComputedRef, PropType, Ref } from "vue";

import { parseDate, getMonthName, formatDateToString } from "@shared/lib";
import { FontIcon } from "@shared/ui";

import "./VCalendar.scss";

interface IDay {
    value: Date;
    disabled: boolean;
    selected: boolean;
}

export default defineComponent({
    name: "VCalendar",
    components: {
        FontIcon
    },
    props: {
        allowedDates: {
            type: Array as PropType<string[]>,
            required: true
        },
        start: {
            type: Date,
            required: true
        }
    },
    emits: ["on-select-date"],
    setup(props, { emit }) {
        const dayNamesMin: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const days: Ref<IDay[][]> = ref([]);
        const currentMonth: Ref<number> = ref(props.start.getMonth());
        const currentYear: Ref<number> = ref(props.start.getFullYear());
        const currentDay: Ref<IDay> = ref({ value: new Date(props.start), disabled: false, selected: true });

        function fillDays(): void {
            days.value = [];
            const firstDateOfMonth: Date = new Date(currentYear.value, currentMonth.value, 1);
            const lastDateOfMonth: Date = new Date(currentYear.value, currentMonth.value + 1, 0);
            const numOfLastDateOfMonth: number = lastDateOfMonth.getDate();
            let currentNumOfDay: number = firstDateOfMonth.getDate();
            let currentDayOfWeek: number = firstDateOfMonth.getDay() - 1 < 0 ? 6 : firstDateOfMonth.getDay() - 1;
            let week: number = 0;
            while (currentNumOfDay <= numOfLastDateOfMonth) {
                for (let i = currentDayOfWeek; i <= 6 && currentNumOfDay <= numOfLastDateOfMonth; i++) {
                    if (!days.value[week]) {
                        days.value[week] = [];
                    }
                    const currentDate: Date = new Date(currentYear.value, currentMonth.value, currentNumOfDay);
                    const isSelected: boolean = props.start.getTime() === currentDate.getTime();
                    const newDay: IDay = {
                        value: new Date(currentYear.value, currentMonth.value, currentNumOfDay),
                        disabled: !props.allowedDates.includes(formatDateToString(currentDate)),
                        selected: isSelected
                    };
                    if (isSelected) {
                        currentDay.value = newDay;
                    }
                    days.value[week]![i] = newDay;
                    ++currentNumOfDay;
                }
                currentDayOfWeek = 0;
                ++week;
            }
        }

        //function fillPreviousDays(firstDateOfMonth: Date, currentDayOfWeek: number) {
        //    let lastDateNumberOfPreviousMonth = new Date(new Date(firstDateOfMonth).setDate(0)).getDate();
        //    for (let i = currentDayOfWeek; i > 0; i--) {
        //        if (!days.value[0]) {
        //            days.value[0] = [];
        //        }
        //        days.value[0][i - 1] = {
        //            value: new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), lastDateNumberOfPreviousMonth),
        //            disabled: true,
        //            selected: false
        //        };
        //        --lastDateNumberOfPreviousMonth;
        //    }
        //}

        //function fillNextDays(lastDateOfMonth: Date, week: number) {
        //    let currentDay = 1;
        //    let currentDayOfWeek = lastDateOfMonth.getDay() - 1 < 0 ? 6 : lastDateOfMonth.getDay() - 1;
        //    for (let i = currentDayOfWeek; i <= 6; i++) {
        //        if (!days.value[week]) {
        //            days.value[week] = [];
        //        }
        //        days.value[week]![i] = { value: currentDay, disabled: true, selected: false };
        //        ++currentDay;
        //    }
        //}

        function onClickLeftArrow(): void {
            --currentMonth.value;
            if (currentMonth.value < 0) {
                currentMonth.value = 11;
                --currentYear.value;
            }
            fillDays();
        }

        function onClickRightArrow(): void {
            ++currentMonth.value;
            if (currentMonth.value > 11) {
                currentMonth.value = 0;
                ++currentYear.value;
            }
            fillDays();
        }

        function onClickDay(day: IDay): void {
            if (!day || day?.selected || day?.disabled) {
                return;
            }
            currentDay.value.selected = false;
            day.selected = true;
            currentDay.value = day;
            emit("on-select-date", formatDateToString(day.value));
        }

        onMounted(() => {
            fillDays();
        });

        return {
            days,
            dayNamesMin,
            currentMonth,
            currentYear,
            getMonthName,
            parseDate,
            onClickLeftArrow,
            onClickRightArrow,
            onClickDay
        };
    }
});
