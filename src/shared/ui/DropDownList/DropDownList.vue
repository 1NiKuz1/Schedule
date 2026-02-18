<template>
    <div class="drop-down-list">
        <div
            class="drop-down-list__content-wrapper"
            :class="{ 'drop-down-list__content-wrapper--selected': isShowDropDownList }"
            @click="isShowDropDownList = !isShowDropDownList"
        >
            <p class="drop-down-list__selected">{{ selectedItem }}</p>
            <font-icon> triangle_down_small </font-icon>
        </div>
        <ul v-show="isShowDropDownList" class="drop-down-list__items" :class="{ 'drop-down-list__items--align-left': isAlignLeft }">
            <li class="drop-down-list__item" v-for="(item, index) in dropDownList" @click="handleItemClick(index)" :key="index">
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import DropDownList from "./DropDownList";
export default DropDownList;
</script>
