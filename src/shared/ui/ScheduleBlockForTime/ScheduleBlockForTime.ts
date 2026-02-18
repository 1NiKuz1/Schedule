import { defineComponent, computed } from "vue";
import { ScheduleBlock } from "@shared/ui";

import "./ScheduleBlockForTime.scss";

export default defineComponent({
    name: "ScheduleBlockForTime",
    components: {
        ScheduleBlock
    },
    props: {
        title: {
            type: String
        },
        description: {
            type: String
        },
        height: {
            type: Number,
            default: 36
        },
        minHeight: {
            type: Number,
            default: 36
        },
        bgColorClass: {
            type: String
        }
    },
    setup(props) {
        const getExtensionStyles = computed(() => ({ height: props.height + "px" }));
        const isShowScheduleExtension = computed(() => props.minHeight > props.height);
        const scheduleBlockHeight = computed(() => (isShowScheduleExtension.value ? props.minHeight + "px" : props.height + "px"));

        return { getExtensionStyles, isShowScheduleExtension, scheduleBlockHeight };
    }
});
