<template>
    <div class="schedule-tooltip-container" @click="handleClick">
        <slot></slot>
        <div v-if="isShowTooltip" :style="position" class="schedule-tooltip">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Tooltip from "./Tooltip";
export default Tooltip;
</script>
