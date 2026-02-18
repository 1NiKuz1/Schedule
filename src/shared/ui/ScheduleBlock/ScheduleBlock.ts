import { defineComponent, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { isNil } from "lodash-es";

import { Sizes } from "@shared/config";
import { resizeObserver, createDebounce } from "@shared/lib";

import "./ScheduleBlock.scss";

export default defineComponent({
    name: "ScheduleBlock",
    props: {
        title: {
            type: String
        },
        description: {
            type: String
        },
        height: {
            type: String
        },
        bgColorClass: {
            type: String
        }
    },
    setup(props) {
        const scheduleBlock = ref<HTMLElement | null>(null);
        const isShowContent = ref<boolean>(true);
        const { debouncedFunction: debouncedUpdateVisibility, cancel } = createDebounce(updateVisibility, 100);

        const getStyles = computed(() => ({
            height: props.height,
            minWidth: Sizes.MIN_WIDTH_SCHEDULE_BLOCK + "px"
        }));

        function isShowTitle() {
            return !isNil(props.title);
        }

        function isShowDescription() {
            return !isNil(props.description);
        }

        function updateVisibility(entry: ResizeObserverEntry) {
            const width: number = entry.contentRect.width;
            const shouldShow: boolean = width >= Sizes.HIDE_WIDTH_CONTENT_SCHEDULE_BLOCK;

            if (shouldShow !== isShowContent.value) {
                isShowContent.value = shouldShow;
            }
        }

        function handleResize(entry: ResizeObserverEntry) {
            debouncedUpdateVisibility(entry);
        }

        onMounted(() => {
            if (scheduleBlock.value) {
                resizeObserver.observe(scheduleBlock.value, handleResize);
            }
        });

        onBeforeUnmount(() => {
            if (scheduleBlock.value) {
                resizeObserver.unobserve(scheduleBlock.value);
            }
            cancel();
        });

        return { scheduleBlock, isShowContent, isShowTitle, isShowDescription, getStyles };
    }
});
