<template>
    <i class="ui-font-icon" :class="{ 'ui-font-icon--disabled': disabled }">
        <slot></slot>
    </i>
</template>

<script setup lang="ts">
import "./FontIcon.scss";

defineProps({
    disabled: {
        type: Boolean
    }
});
</script>
