<template>
    <div class="schedule-week-template" ref="scheduleWeekTemplate">
        <div :style="{ width: ROW_HEIGHT_PX }">
            <TimeBlock :value="''" :height="'55px'" :width="ROW_HEIGHT_PX" />
            <TimeBlock
                v-for="(hour, index) in hours"
                :key="hour"
                :value="hour + ':00'"
                :height="ROW_HEIGHT_PX"
                :width="ROW_HEIGHT_PX"
                :isShowDots="isShowDots(index, hours)"
            />
        </div>
        <div v-for="[key, events] of weekEvents" :key="parseDate(key).getDate()" class="schedule-week-template__wrapper">
            <div class="head-day" :class="{ 'head-day--selected': isToday(key) }">
                <div class="head-day__col">
                    <div class="head-day__cell head-day__day-of-week">{{ dayNamesMin[parseDate(key).getDay()] }}</div>
                    <div class="head-day__cell head-day__num-day">{{ parseDate(key).getDate() }}</div>
                </div>
                <div class="head-day__col">
                    <div class="head-day__cell head-day__desc-count-of-tiles">
                        {{ isToday(key) ? "today" : "per day" }}
                    </div>
                    <div class="head-day__cell head-day__count-of-tiles">{{ events.length }}</div>
                </div>
            </div>
            <EventLayout
                :events="events"
                :isToday="isToday(key)"
                :hours="hours"
                :isShowAllRows="isShowAllRows"
                @on-click-event="onClickEvent"
            />
        </div>
    </div>
</template>

<script lang="ts">
import ScheduleWeekTemplate from "./ScheduleWeekTemplate";
export default ScheduleWeekTemplate;
</script>
