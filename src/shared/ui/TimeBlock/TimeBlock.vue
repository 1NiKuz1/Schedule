<template>
    <div class="time-block-wrapper" :style="{ width, height }" :class="{ 'hide-border-top': isShowDots }">
        <div class="dots-container" v-if="isShowDots">
            <div class="dot" v-for="n of 3"></div>
        </div>
        <div class="time-block">
            <span>{{ value }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import "./TimeBlock.scss";

defineProps({
    height: {
        type: String
    },
    width: {
        type: String
    },
    value: {
        type: String
    },
    isShowDots: {
        type: Boolean
    }
});
</script>
