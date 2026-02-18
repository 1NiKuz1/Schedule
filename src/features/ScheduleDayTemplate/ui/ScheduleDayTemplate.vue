<template>
    <div class="schedule-day-template" ref="scheduleDayTemplate">
        <div :style="{ width: ROW_HEIGHT_PX }">
            <TimeBlock
                v-for="(hour, index) in hours"
                :key="hour"
                :value="hour + ':00'"
                :height="ROW_HEIGHT_PX"
                :width="ROW_HEIGHT_PX"
                :isShowDots="isShowDots(index, hours)"
            />
        </div>
        <EventLayout :events="events" :isToday="isToday" :hours="hours" :isShowAllRows="isShowAllRows" @on-click-event="onClickEvent" />
    </div>
</template>

<script lang="ts">
import ScheduleDayTemplate from "./ScheduleDayTemplate";
export default ScheduleDayTemplate;
</script>
