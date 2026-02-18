<template>
    <div class="events" :class="{ 'events--selected': isToday }" :style="lineStyles" ref="scheduleEvents">
        <template v-if="eventLayout">
            <!-- Event tiles -->
            <template v-for="line of lines">
                <template v-for="tile of line.tiles">
                    <ScheduleBlockForTime
                        @click.native="onClickEvent(tile)"
                        :style="getTilesPosition(tile)"
                        :title="tile.title"
                        :description="formatEventTimeRange(tile)"
                        :height="getTileHeight(tile)"
                        :minHeight="MIN_HEIGHT_SCHEDULE_BLOCK"
                        :bgColorClass="tile.bgColorClass"
                    />
                </template>
            </template>
            <!-- Hidden events -->
            <template v-for="[key, hiddenTiles] of eventLayout.hiddenTilesMap.entries()">
                <Tooltip v-if="hiddenTiles.length" :style="getTooltipPosition(key, buttonWidth)">
                    <OvalText>{{ hiddenTiles.length > 99 ? "99+" : hiddenTiles.length }}</OvalText>
                    <template #body>
                        <EventsList>
                            <li class="events-list-item" v-for="(tile, index) in hiddenTiles" @click="onClickEvent(tile)" :key="index">
                                <span class="events-list-item__description">{{ tile.description }}</span>
                                <p class="events-list-item__title">{{ tile.title }} </p>
                            </li>
                        </EventsList>
                    </template>
                </Tooltip>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import EventLayout from "./EventLayout";
export default EventLayout;
</script>
