<template>
    <ScheduleContainer
        :scheduleEvents="scheduleEvents"
        :componentsList="componentsList"
        :rangeTypes="rangeTypes"
        :allowedDates="allowedDates"
        :currentTemplate="currentTemplate"
        :startTypeOfRange="startTypeOfRange"
        v-model:start="start"
        v-model:end="end"
        @on-change-drop-down-list="onChangeDropDownList"
        @on-select-date="onSelectDate"
        @on-click-schedule-event="onClickScheduleEvent"
    />
</template>

<script lang="ts">
import VSchedule from "./VSchedule";
export default VSchedule;
</script>
