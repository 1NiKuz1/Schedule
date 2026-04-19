import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";
import type { PropType } from "vue";
import FontIcon from "../FontIcon/FontIcon.vue";
import "./DropDownList.scss";

export default defineComponent({
    name: "DropDownList",
    components: {
        FontIcon
    },
    props: {
        dropDownList: {
            type: Array as PropType<Array<string>>,
            required: true
        },
        selectedItem: {
            type: String,
            required: true
        },
        isAlignLeft: {
            type: Boolean
        }
    },
    emits: ["on-change"],
    setup(props, { emit }) {
        const isShowDropDownList = ref<boolean>(false);

        function handleItemClick(index: number): void {
            isShowDropDownList.value = false;
            emit("on-change", props.dropDownList[index]);
        }

        function handleClickOutside(event: MouseEvent): void {
            const target = event.target as HTMLElement;
            if (target && !target.closest(".drop-down-list")) {
                isShowDropDownList.value = false;
            }
        }

        onMounted(() => {
            document.addEventListener("click", handleClickOutside);
        });

        onBeforeUnmount(() => {
            document.removeEventListener("click", handleClickOutside);
        });

        return {
            isShowDropDownList,
            handleItemClick,
            handleClickOutside
        };
    }
});
