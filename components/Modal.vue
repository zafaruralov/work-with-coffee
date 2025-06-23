<template>
  <div v-if="modalConfig.isOpen" class="fixed inset-0 pointer-events-none" :style="{ zIndex: zIndex }">
    <div
      ref="modalRef"
      class="absolute bg-white rounded-lg shadow-xl pointer-events-auto min-h-2 max-h-[600px]"
      :class="{ 'w-100': !modalConfig.isMinimized, 'w-64': modalConfig.isMinimized }"
      :style="{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: '-50%',
        marginTop: '-25%'
      }"
      @mousedown="bringToFront"
    >
      <div
        ref="headerRef"
        class="bg-[#2f2010] text-white px-4 py-3 rounded-t-lg cursor-move select-none flex items-center justify-between"
        @mousedown="startDrag"
      >
        <h2 class="text-lg font-semibold">{{ modalConfig.title }}</h2>
        <div class="flex items-center space-x-2">
          <button
            class="cursor-pointer w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors"
            @click="minimizeModal"
          >
            <span class="text-xs text-white font-bold">{{ modalConfig.isMinimized ? "+" : "−" }}</span>
          </button>
          <button
            class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
            @click="closeModals(modalConfig.id)"
          >
            <span class="text-xs text-white font-bold">X</span>
          </button>
        </div>
      </div>

      <div v-show="!modalConfig.isMinimized" class="bg-gray-100 rounded-b-lg overflow-auto p-4 h-[100%]">
        <component
          v-if="componentMap[modalConfig.component]"
          :is="componentMap[modalConfig.component]"
          :modal-config="modalConfig"
        />
        <div v-else class="p-6">
          <p class="text-gray-600">{{ modalConfig.title }} content goes here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModalConfig } from "~/types/type";
import Music from "./Music.vue";
import Timer from "./Timer.vue";
import ToDoList from "./ToDoList.vue";
import Settings from "./Settings.vue";
import Feedback from "./Feedback.vue";
import Debt from "./Debt.vue";

interface Props {
  modalConfig: ModalConfig;
  zIndex: number;
}
const componentMap: any = {
  Music,
  Timer,
  ToDoList,
  Settings,
  Feedback,
  Debt
};

const props = defineProps<Props>();
const {
  closeModal: closeModalStore,
  minimizeModal: minimizeModalStore,
  updateModalPosition,
  bringToFront: bringToFrontStore
} = useModal();

const modalRef = ref<HTMLElement>();
const headerRef = ref<HTMLElement>();

const position = ref(props.modalConfig.position);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

watch(
  () => props.modalConfig.position,
  (newPos) => {
    position.value = newPos;
  },
  { deep: true }
);

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  };

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  event.preventDefault();
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !modalRef.value || !headerRef.value) return;

  const modalWidth = modalRef.value.offsetWidth;
  const headerHeight = headerRef.value.offsetHeight;

  let newX = event.clientX - dragStart.value.x;
  let newY = event.clientY - dragStart.value.y;

  const maxX = window.innerWidth - modalWidth;
  const maxY = window.innerHeight - headerHeight;

  newX = Math.min(Math.max(0, newX), maxX);
  newY = Math.min(Math.max(0, newY), maxY);

  const newPosition = { x: newX, y: newY };

  position.value = newPosition;
  updateModalPosition(props.modalConfig.id, newPosition);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

const closeModals = (id: string) => {
  closeModalStore(id);
};

const minimizeModal = () => {
  minimizeModalStore(props.modalConfig.id);
};

const bringToFront = () => {
  bringToFrontStore(props.modalConfig.id);
};

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>
