<template>
  <div
    class="flex h-11 items-center gap-1 rounded-md p-1 shadow-xs bg-primary border-secondary border-2 text-white relative justify-between"
  >
    <div class="px-4">
      <img src="/images/coffee.webp" alt="coffee" class="" />
    </div>

    <div v-for="item in appItems" :key="item.name" class="relative dropdown-wrapper">
      <button
        @click.stop="toggleDropdown(item.name)"
        class="flex items-center gap-2 rounded-sm px-3 py-1 text-sm font-medium hover:bg-[var(--accent)]"
        :class="{ 'bg-[var(--accent)]': activeDropdown === item.name }"
      >
        {{ item.name }}
      </button>

      <div v-if="activeDropdown === item.name" class="absolute mt-2 w-56 bg-white text-black shadow-lg rounded p-2">
        <div v-if="item.name === 'About'" class="">
          <p class="" v-if="item.name === 'About'">version</p>
        </div>
        <ul class="flex flex-col text-sm">
          <li
            v-for="child in item.children"
            :key="child.label"
            class="px-3 py-2 hover:bg-[var(--accent)] flex items-center gap-2 cursor-pointer rounded-md hover:text-white"
            @click="openApp(child)"
          >
            <span>{{ child.icon }}</span>
            <span v-show="child.label">{{ child.label }}</span>
          </li>
        </ul>

        <hr v-if="item.name === 'Apps'" class="my-1" />
        <button
          v-if="item.name === 'Apps'"
          class="select-none text-center px-3 py-2 items-center rounded-md text-red-600 hover:bg-[var(--accent)] hover:text-black transition cursor-pointer text-sm font-semibold"
        >
          Reset System
        </button>
      </div>
    </div>
    <div class="taskbar-clock ml-auto flex items-center gap-3">
      <div class="">should be sound and coffee</div>
      <div class="taskbar-clock ml-auto mr-2 text-sm font-medium whitespace-nowrap uppercase">{{ time }}</div>
    </div>
    <!-- </div> -->
  </div>
  <Modal v-for="modal in getOpenModals" :key="modal.id" :modal-config="modal" />
</template>
<script setup lang="ts">
const { getOpenModals, openModal } = useModal();
const appItems = [
  {
    name: "Menu",
    children: [
      { id: 1, icon: "🔧", label: "Blog", component: "Music" },
      { id: 2, icon: "📂", label: "Feedback", component: "Music" }
    ]
  },
  {
    name: "Apps",
    children: [
      { id: 3, icon: "⏰", label: "Timer", component: "Timer" },
      { id: 4, icon: "📝", label: "To-Do List", component: "ToDoList" },
      { id: 6, icon: "🎧", label: "Music Player", component: "Music" },
      { id: 7, icon: "📓", label: "Notepad", component: "Music" },
      { id: 8, icon: "🔖", label: "Bookmark", component: "Music" },
      { id: 9, icon: "⚙️", label: "Settings", component: "Settings" }
    ]
  },
  {
    name: "About",
    children: [
      { id: 10, icon: "ℹ️", label: "Info", component: "Music" },
      { id: 11, icon: "❤️", label: "Github", component: "Music" }
    ]
  }
];

const openApp = (child: { label: string; component?: string }) => {
  if (child.component) {
    openModal(child.label, child.label, child.component);
  }
};

const time = ref("");
const activeDropdown = ref<string | null>(null);

function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  time.value = `${formattedHour}:${formattedMinutes} ${ampm}`;
}
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  window.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown-wrapper")) {
      activeDropdown.value = null;
    }
  });
});

function toggleDropdown(name: string) {
  activeDropdown.value = activeDropdown.value === name ? null : name;
}
</script>
