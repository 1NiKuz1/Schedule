<template>
    <div class="schedule-month-template" ref="scheduleMonthTemplate">
        <table class="schedule-month-template__content">
            <thead>
                <tr>
                    <th v-for="day of visibleDayNamesMin">{{ day }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="week of visibleEvents">
                    <td v-for="day of week" class="day-of-month" :class="{ 'day-of-month--selected': isToday(day.date) }">
                        <div class="day-of-month__head">
                            <p class="day-of-month__num-day">{{ day.date.getDate() }}</p>
                            <Tooltip class="day-of-month__count-events" v-if="day.hiddenEvents.length">
                                <OvalText>{{ day.hiddenEvents.length > 999 ? "999+" : day.hiddenEvents.length }}</OvalText>
                                <template #body>
                                    <EventsList>
                                        <li
                                            class="events-list-item"
                                            v-for="(event, index) in day.hiddenEvents"
                                            @click="onClickEvent(event)"
                                            :key="index"
                                        >
                                            <span class="events-list-item__description">{{ formatEventTimeRange(event) }}</span>
                                            <p class="events-list-item__title">{{ event.title }} </p>
                                        </li>
                                    </EventsList>
                                </template>
                            </Tooltip>
                        </div>
                        <div class="day-of-month__body" :style="{ minHeight: `${HEIGHT_SCHEDULE_BLOCK * MAX_COUNT_OF_VISIBLE_TILES}px` }">
                            <template v-for="event of day.events">
                                <ScheduleBlock
                                    @click.native="onClickEvent(event)"
                                    :title="event.title"
                                    :description="formatEventTimeRange(event)"
                                    :height="HEIGHT_SCHEDULE_BLOCK + 'px'"
                                    :bgColorClass="event.bgColorClass"
                                    :style="{
                                        'margin-bottom': `${INDENT_SCHEDULE_BLOCK}px`
                                    }"
                                />
                            </template>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import ScheduleMonthTemplate from "./ScheduleMonthTemplate";
export default ScheduleMonthTemplate;
</script>
