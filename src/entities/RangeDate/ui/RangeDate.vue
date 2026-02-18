<template>
    <div class="range-date">
        <font-icon :disabled="isDisableLeftArrow" @click="onClickLeftArrow"> chevron_left </font-icon>
        <p class="range-date__visible-date" @click="onClickVisibleDate">{{ visibleDate }}</p>
        <font-icon :disabled="isDisableRightArrow" @click="onClickRightArrow"> chevron_right </font-icon>
        <VCalendar v-if="isShowDatePicker" :start="currentDate" :allowedDates="allowedDates" @on-select-date="onSelectDate" />
    </div>
</template>

<script lang="ts">
import RangeDate from "./RangeDate";
export default RangeDate;
</script>
