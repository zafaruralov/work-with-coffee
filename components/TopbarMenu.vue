<template>
  <nav
    class="nav relative flex justify-center max-w-sm pb-5 rounded-t-md rounded-b-3xl mx-auto mt-72 bg-white shadow-2xl"
  >
    <button
      @click="toggleMenu"
      :class="[
        'menu-toggle relative w-20 h-20 flex items-center justify-center text-base cursor-pointer z-10 rounded-full transform -translate-y-1/2 transition-all duration-200',
        isMenuOpen ? 'bg-gray-900 translate-y-[-calc(50%-4px)]' : 'bg-violet-600 hover:bg-violet-700'
      ]"
    >
      <span class="text-white font-medium">Menu</span>
    </button>

    <ul class="menu">
      <li
        v-for="(item, index) in menuItems"
        :key="item.label"
        :class="[
          'menu-item absolute top-[-25px] left-1/2 transform -translate-x-1/2 transition-all duration-400',
          `delay-${getDelay(index)}`,
          isMenuOpen && getOpenPosition(index)
        ]"
      >
        <a
          :href="item.href"
          class="w-12 h-12 rounded-full flex items-center justify-center bg-violet-600 hover:bg-violet-700 transition-colors relative group"
        >
          <span
            :class="[
              'menu-label absolute top-0 left-0 transform -translate-y-full -translate-y-1 w-full text-xs whitespace-nowrap pointer-events-none transition-opacity duration-300 text-gray-900 font-bold text-center',
              isMenuOpen ? 'opacity-100 delay-900' : 'opacity-0'
            ]"
          >
            {{ item.label }}
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface MenuItem {
  id: number;
  label: string;
  component: string;
  icon: any;
}

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
    "top-[-210px] delay-100",
    "top-[-160px] left-[calc(50%-75px)] delay-200",
    "top-[-160px] left-[calc(50%+75px)] delay-300",
    "top-[-110px] delay-400"
  ];
  return positions[index] || "";
};
</script>

<style scoped>
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
