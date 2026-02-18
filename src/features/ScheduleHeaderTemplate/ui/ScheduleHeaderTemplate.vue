<template>
    <div class="schedule-header-template" ref="scheduleHeaderTemplate">
        <div>
            <RangeDate :allowedDates="allowedDates" v-model:start="startDate" v-model:end="endDate" @on-select-date="onSelectDate" />
        </div>
        <div>
            <slot></slot>
        </div>
        <div class="schedule-header-template__drop-down">
            <DropDownList :selectedItem="selectedTypeOfRange" :dropDownList="rangeTypes" @on-change="onChangeDropDownList" />
        </div>
    </div>
</template>

<script lang="ts">
import ScheduleHeaderTemplate from "./ScheduleHeaderTemplate";
export default ScheduleHeaderTemplate;
</script>
