<template>
    <div class="schedule-block" :style="getStyles" :class="bgColorClass" ref="scheduleBlock">
        <div v-show="isShowContent">
            <p v-if="isShowTitle()" class="schedule-block__title">{{ title }}</p>
            <p v-if="isShowDescription()" class="schedule-block__description">{{ description }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import ScheduleBlock from "./ScheduleBlock";
export default ScheduleBlock;
</script>
