<template>
    <div class="vcalendar" @click.stop="">
        <div class="vcalendar__navigation">
            <font-icon @click="onClickLeftArrow"> chevron_left </font-icon>
            <p class="vcalendar__current-date">{{ getMonthName(new Date(currentYear, currentMonth), false) }} {{ currentYear }}</p>
            <font-icon @click="onClickRightArrow"> chevron_right </font-icon>
        </div>
        <table>
            <thead>
                <tr>
                    <th v-for="day of dayNamesMin" :key="day" class="vcalendar__day-of-week">{{ day }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="week in days">
                    <td v-for="day in week">
                        <span
                            class="vcalendar__day"
                            :class="{ 'vcalendar__day--selected': day?.selected, 'vcalendar__day--disabled': !day || day.disabled }"
                            @click="onClickDay(day)"
                            >{{ day?.value.getDate() }}</span
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import VCalendar from "./VCalendar";
export default VCalendar;
</script>
