<template>
    <div class="schedule-block-wrapper">
        <div v-if="isShowScheduleExtension" :style="getExtensionStyles" :class="bgColorClass" class="schedule-block-extension"></div>
        <ScheduleBlock
            :title="title"
            :description="description"
            :height="scheduleBlockHeight"
            :bgColorClass="bgColorClass"
        />
    </div>
</template>

<script lang="ts">
import ScheduleBlockForTime from "./ScheduleBlockForTime";
export default ScheduleBlockForTime;
</script>
