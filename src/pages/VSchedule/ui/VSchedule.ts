import { defineComponent, ref, watch } from "vue";
import type { Ref } from "vue";
import type { IEvent } from "@shared/typings";
import { formatDateToString, hashStringToNumber, parseDate } from "@shared/lib";
import { ScheduleContainer } from "@widgets/ScheduleContainer";

export default defineComponent({
    name: "VSchedule",
    components: {
        ScheduleContainer
    },
    setup() {
        const allowedDates: Ref<string[]> = ref([]);
        const componentsList: Ref<string[]> = ref(["ScheduleDayTemplate", "ScheduleWeekTemplate", "ScheduleMonthTemplate"]);
        const rangeTypes: Ref<string[]> = ref(["Day", "Week", "Month"]);
        const currentTemplate: Ref<string> = ref("ScheduleMonthTemplate");
        const startTypeOfRange: Ref<string> = ref("Month");
        const start: Ref<string> = ref("2023-10-01");
        const end: Ref<string> = ref("2023-11-04");
        const allEvents: IEvent[] = createEveryHoursEvents();
        const scheduleEvents: Ref<IEvent[]> = ref(allEvents);

        function createEveryHoursEvents(): IEvent[] {
            const currnetStart: Date = new Date("2023-10-01T00:00");
            const currnetEnd: Date = new Date("2023-10-01T00:30");
            const events: IEvent[] = [];
            const endPoint: Date = new Date("2023-10-02T10:00");
            let counter: number = 0;
            for (let i = 0; i < 30; ++i) {
                allowedDates.value.push(formatDateToString(currnetStart));
                do {
                    const title: string = "MeetingHours_" + counter;
                    const colorNumber: number = (Math.abs(hashStringToNumber(title)) % 30) + 1;
                    events.push({
                        id: counter + "",
                        start: new Date(currnetStart),
                        end: new Date(currnetEnd),
                        title,
                        bgColorClass: "viz-color-back-" + colorNumber
                    });
                    ++counter;
                    currnetStart.setHours(currnetStart.getHours() + 1);
                    currnetEnd.setHours(currnetEnd.getHours() + 1);
                } while (currnetStart.getDate() !== endPoint.getDate());
                endPoint.setDate(endPoint.getDate() + 1);
            }

            return events;
        }

        function onChanged(val: string, oldVal: string): void {
            if (val === oldVal) {
                return;
            }
            scheduleEvents.value = allEvents.filter(
                event => formatDateToString(event.start) >= start.value && formatDateToString(event.start) <= end.value
            );
        }

        function changeRangeDates(typeOfRange: string, newStart: string): void {
            start.value = newStart;
            const bufStartDate = parseDate(start.value)!;
            switch (typeOfRange) {
                case rangeTypes.value[0]:
                    currentTemplate.value = componentsList.value[0]!;
                    end.value = start.value;
                    break;
                case rangeTypes.value[1]:
                    currentTemplate.value = componentsList.value[1]!;
                    bufStartDate.setDate(bufStartDate.getDate() + 6);
                    end.value = formatDateToString(bufStartDate);
                    break;
                case rangeTypes.value[2]:
                    currentTemplate.value = componentsList.value[2]!;
                    bufStartDate.setDate(bufStartDate.getDate() + 34);
                    end.value = formatDateToString(bufStartDate);
                    break;
            }
        }

        function onChangeDropDownList(typeOfRange: string): void {
            changeRangeDates(typeOfRange, allowedDates.value[0]!);
        }

        function onSelectDate(newDate: string): void {
            currentTemplate.value = componentsList.value[0]!;
        }

        function onClickScheduleEvent(event: IEvent): void {
            console.log(event);
        }

        watch(start, (newVal, oldVal) => onChanged(newVal, oldVal));
        watch(end, (newVal, oldVal) => onChanged(newVal, oldVal));

        return {
            scheduleEvents,
            allowedDates,
            componentsList,
            rangeTypes,
            currentTemplate,
            startTypeOfRange,
            start,
            end,
            onChangeDropDownList,
            onSelectDate,
            onClickScheduleEvent
        };
    }
});
