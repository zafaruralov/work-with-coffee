<template>
  <nav class="relative flex justify-center items-end h-full">
    <button
      @click="toggleMenu"
      :class="[
        'menu-toggle relative w-20 h-20 flex items-center justify-center text-base cursor-pointer z-10 rounded-full transform -translate-y-1/2 transition-all duration-200',
        'bg-[#a65330] '
      ]"
    >
      <span class="text-white font-medium">Apps</span>
    </button>

    <li
      v-for="(item, index) in menuItems"
      :key="item.label"
      :class="[
        'absolute cursor-pointer bottom-[5%] left-1/2 transform -translate-x-1/2 transition-all duration-400',
        `delay-${getDelay(index)}`,
        isMenuOpen && getOpenPosition(index)
      ]"
      @click="openApp(item)"
    >
      <a class="w-10 h-10 rounded-full flex items-center justify-center bg-[#a65330] transition-colors relative group">
        <span
          :class="[
            'absolute top-0 left-0 transform -translate-y-full -translate-y-1 w-full text-xs whitespace-nowrap pointer-events-none transition-opacity duration-300 text-white font-bold text-center',
            isMenuOpen ? 'opacity-100 delay-900' : 'opacity-0'
          ]"
        >
          {{ item.label }}
        </span>
        <span>{{ item.icon }}</span>
      </a>
    </li>
  </nav>
  <Modal v-for="(modal, index) in getOpenModals" :key="modal.id" :modal-config="modal" :z-index="100 + index" />
</template>

<script setup lang="ts">
const { getOpenModals, openModal } = useModal();
interface MenuItem {
  id: number;
  label: string;
  component: string;
  icon: any;
}

const openApp = (child: { label: string; component?: string }) => {
  if (child.component) {
    openModal(child.label, child.label, child.component);
  }
};

const isMenuOpen = ref(false);

const menuItems: MenuItem[] = [
  { id: 3, icon: "⏰", label: "Timer", component: "Timer" },
  { id: 4, icon: "📝", label: "To-Do List", component: "ToDoList" },
  { id: 6, icon: "🎧", label: "Music Player", component: "Music" },
  { id: 7, icon: "📓", label: "Notepad", component: "Music" },
  { id: 8, icon: "🔖", label: "Bookmark", component: "Music" },
  { id: 9, icon: "⚙️", label: "Settings", component: "Settings" }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const getDelay = (index: number): string => {
  const delays = ["300", "250", "200", "150", "100", "50"];
  return delays[index] || "0";
};

const getOpenPosition = (index: number): string => {
  const positions = [
    "bottom-[0%] left-[calc(50%-88px)] delay-150",
    "bottom-[13%] left-[calc(50%-90px)] delay-100",
    "bottom-[20%] left-[calc(50%-45px)] delay-50",
    "bottom-[20%] left-[calc(51.9%)] delay-150",
    "bottom-[13%] left-[calc(54.5%)] delay-100",
    "bottom-[0%] left-[calc(54.4%)] delay-200"
  ];
  return positions[index] || "";
};
</script>

<style>
.delay-200 {
  transition-delay: 0.2s;
}

.delay-150 {
  transition-delay: 0.15s;
}

.delay-100 {
  transition-delay: 0.1s;
}

.delay-50 {
  transition-delay: 0.05s;
}

.delay-900 {
  transition-delay: 0.9s;
}
</style>
