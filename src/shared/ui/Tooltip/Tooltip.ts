import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import "./Tooltip.scss";

type Position = {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
};

const openTooltips: Ref<boolean>[] = [];

export default defineComponent({
    name: "Tooltip",
    setup() {
        const TOOLTIP_MARGIN: number = 10;
        const isShowTooltip = ref<boolean>(false);
        const position: Position = {};

        function calculatePosition(event: MouseEvent): void {
            if (!isShowTooltip) {
                return;
            }
            const viewportWidth: number = document.documentElement.clientWidth;
            const viewportHeight: number = document.documentElement.clientHeight;
            const triggerRect: DOMRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            // Horizontal positioning
            if (triggerRect.left / viewportWidth < 0.5) {
                position.left = `${event.offsetX}px`;
            } else {
                position.right = `${triggerRect.width - event.offsetX}px`;
            }

            // Vertical positioning
            if (triggerRect.bottom / viewportHeight < 0.5) {
                position.top = `${event.offsetY + TOOLTIP_MARGIN}px`;
            } else {
                position.bottom = `${triggerRect.height - event.offsetY + TOOLTIP_MARGIN}px`;
            }
        }

        function handleClick(event): void {
            if (isShowTooltip.value) {
                isShowTooltip.value = false;
            } else {
                // Closing all open tooltips
                openTooltips.forEach(tooltipRef => {
                    tooltipRef.value = false;
                });
                openTooltips.length = 0;
                isShowTooltip.value = true;
                openTooltips.push(isShowTooltip);
                calculatePosition(event);
            }
        }

        function handleClickOutside(event): void {
            if (!event.target.closest(".schedule-tooltip-container")) {
                isShowTooltip.value = false;
            }
        }

        onMounted(() => {
            document.addEventListener("click", handleClickOutside);
        });

        onBeforeUnmount(() => {
            document.removeEventListener("click", handleClickOutside);
        });

        return { isShowTooltip, position, handleClick };
    }
});
