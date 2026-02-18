<template>
    <div class="schedule-container">
        <div class="schedule-container__wrapper" v-if="allowedDates.length">
            <ScheduleHeaderTemplate
                :allowedDates="allowedDates"
                :rangeTypes="rangeTypes"
                v-model:start="startDate"
                v-model:end="endDate"
                :startTypeOfRange="startTypeOfRange"
                @on-change-drop-down-list="onChangeDropDownList"
                @on-select-date="onSelectDate"
            >
                <div class="information-groups">
                    <div class="information-groups__content">
                        ACCORDING TO THE SCHEDULE:
                        <LinkAction @click.native="$emit('on-click-scheduler', $event)">{{ scheduleEvents.length }}</LinkAction>
                    </div>
                </div>
            </ScheduleHeaderTemplate>
            <component
                :is="currentTemplate"
                :style="{ 'margin-top': currentTemplate === componentsList[0] ? '16px' : '0' }"
                :events="scheduleEvents"
                :start="start"
                @on-click-event="onClickScheduleEvent"
            />
        </div>
    </div>
</template>

<script lang="ts">
import ScheduleContainer from "./ScheduleContainer";
export default ScheduleContainer;
</script>
