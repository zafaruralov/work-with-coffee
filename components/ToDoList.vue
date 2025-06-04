<template>
  <div class="p-4 flex gap-4 flex-col h-full bg-stone-50">
    <div class="flex">
      <input
        v-model="newTaskText"
        @keyup.enter="addTask"
        type="text"
        class="flex-grow bg-white p-2 border border-gray-300 rounded-l min-w-0"
        placeholder="Add a bew task"
      />
      <button class="bg-[#6f4018] text-white px-4 py-2 rounded-r hover:bg-accent" @click="addTask">+</button>
    </div>
    <div class="flex-grow overflow-y-auto gap-4">
      <div class="">
        <div class="bg-stone-200 px-3 py-2 rounded flex justify-between items-center">
          <div
            role="button"
            tabindex="0"
            aria-disabled="false"
            aria-roledescription="sortable"
            class="cursor-grab mr-2 touch-none"
            @mousedown.stop
            @dragstart.prevent
          >
            <img src="/public/images/handle.svg" alt="handle icon" />
          </div>
          <h3
            class="font-semibold flex items-center text-primary flex-grow cursor-pointer"
            @click="toggleSection('todo')"
          >
            To Do
            <span class="ml-2 bg-amber-50 text-accent rounded-full w-6 h-6 flex items-center justify-center text-xs">{{
              todoTasks.length
            }}</span>
          </h3>
          <span class="cursor-pointer" @click="toggleSection('todo')">
            <img src="/public/images/dropIcon.svg" alt="drop icon" />
          </span>
        </div>
        <div v-if="todoTasks.length === 0" class="bg-gray-50">
          <div
            class="text-gray-400 text-center italic text-sm py-6 border border-dashed border-gray-300 my-2 mx-2 rounded bg-gray-50"
          >
            Drop tasks here
          </div>
        </div>
        <ul v-else>
          <!-- TODO -->
          <li
            class="bg-white p-3 my-1 rounded"
            style="transition: transform linear"
            v-for="(task, index) in todoTasks"
            :key="task.id"
            @dragover.prevent="handleDragOver($event, index, 'todo')"
            @drop="handleDrop($event, index, 'todo')"
          >
            <div class="flex flex-col justify-center items-start relative w-full">
              <div class="flex w-full items-center">
                <div
                  role="button"
                  tabindex="0"
                  aria-disabled="false"
                  aria-roledescription="sortable"
                  class="cursor-grab mr-2 touch-none"
                  draggable="true"
                  @dragstart="handleDragStart($event, task, index)"
                  @dragend="handleDragEnd"
                  @mousedown.stop
                >
                  <img src="/public/images/handle.svg" alt="handle" />
                </div>
                <input
                  v-if="editingTaskId === task.id"
                  v-model="editingText"
                  @blur="saveEdit(task)"
                  @keyup.enter="saveEdit(task)"
                  @keyup.escape="cancelEdit"
                  @mousedown.stop
                  @dragstart.prevent
                  class="flex-grow border-2 border-blue-500 rounded px-2 py-1 focus:outline-none"
                  ref="editInput"
                />
                <span v-else @mousedown.stop @dragstart.prevent class="flex-grow px-2 py-1 rounded">
                  {{ task.text }}
                </span>
              </div>
              <div class="flex items-center justify-between w-full mt-2">
                <div class="flex items-center justify-start ml-1"></div>
                <div class="flex items-center justify-end gap-1">
                  <select
                    v-model="task.status"
                    @change="updateTaskStatus(task)"
                    @mousedown.stop
                    @dragstart.prevent
                    class="text-xs bg-transparent border rounded"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button @click="startEdit(task)" @mousedown.stop @dragstart.prevent>
                    <div class="relative hover:bg-blue-200 p-1 rounded">
                      <img src="/public/images/pen.svg" alt="pen" />
                    </div>
                  </button>
                  <button @click="deleteTask(task.id)" @mousedown.stop @dragstart.prevent>
                    <div class="relative hover:bg-red-200 p-1 rounded">
                      <img src="/public/images/delete.svg" alt="delete" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </li>
          <!-- Progress -->
          <!-- DONE -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";

interface Task {
  id: number;
  text: string;
  status: "todo" | "inprogress" | "done";
  order: number;
}

// Reactive state
const newTaskText = ref("");
const tasks = ref<Task[]>([{ id: 1, text: "Example task", status: "todo", order: 0 }]);
const draggedTask = ref<Task | null>(null);
const draggedIndex = ref<number>(-1);
const editingTaskId = ref<number | null>(null);
const editingText = ref("");

const sectionsExpanded = ref({
  todo: false, // Changed to false to match your design
  inprogress: false,
  done: false
});

// Computed properties
const todoTasks = computed(() => {
  return tasks.value.filter((task) => task.status === "todo").sort((a, b) => a.order - b.order);
});

const inProgressTasks = computed(() => {
  return tasks.value.filter((task) => task.status === "inprogress").sort((a, b) => a.order - b.order);
});

const doneTasks = computed(() => {
  return tasks.value.filter((task) => task.status === "done").sort((a, b) => a.order - b.order);
});

// Methods
const addTask = () => {
  if (newTaskText.value.trim()) {
    const maxOrder = todoTasks.value.length > 0 ? Math.max(...todoTasks.value.map((t) => t.order)) + 1 : 0;

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.value.trim(),
      status: "todo",
      order: maxOrder
    };

    tasks.value.push(newTask);
    newTaskText.value = "";
  }
};

const deleteTask = (taskId: number) => {
  const index = tasks.value.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    tasks.value.splice(index, 1);
  }
};

// In-place editing methods
const startEdit = (task: Task) => {
  editingTaskId.value = task.id;
  editingText.value = task.text;
  nextTick(() => {
    const input = document.querySelector('input[ref="editInput"]') as HTMLInputElement;
    if (input) {
      input.focus();
      input.select();
    }
  });
};

const saveEdit = (task: Task) => {
  if (editingText.value.trim()) {
    task.text = editingText.value.trim();
  }
  editingTaskId.value = null;
  editingText.value = "";
};

const cancelEdit = () => {
  editingTaskId.value = null;
  editingText.value = "";
};

const updateTaskStatus = (task: Task) => {
  let targetTasks;
  if (task.status === "todo") {
    targetTasks = todoTasks.value;
  } else if (task.status === "inprogress") {
    targetTasks = inProgressTasks.value;
  } else {
    targetTasks = doneTasks.value;
  }

  const maxOrder = targetTasks.length > 0 ? Math.max(...targetTasks.map((t) => t.order)) + 1 : 0;

  task.order = maxOrder;
};

const toggleSection = (section: keyof typeof sectionsExpanded.value) => {
  sectionsExpanded.value[section] = !sectionsExpanded.value[section];
};

// Drag and drop functionality
const handleDragStart = (event: DragEvent, task: Task, index: number) => {
  if (!event.dataTransfer) return;

  draggedTask.value = task;
  draggedIndex.value = index;

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", task.id.toString());
  event.stopPropagation();
};

const handleDragEnd = () => {
  draggedTask.value = null;
  draggedIndex.value = -1;
};

const handleDragOver = (event: DragEvent, index: number, status: string) => {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer!.dropEffect = "move";
};

const handleDrop = (event: DragEvent, dropIndex: number, status: Task["status"]) => {
  event.preventDefault();
  event.stopPropagation();

  if (!draggedTask.value) return;

  const draggedTaskRef = draggedTask.value;

  // Get the current tasks in the target section
  let targetTasks;
  if (status === "todo") {
    targetTasks = [...todoTasks.value];
  } else if (status === "inprogress") {
    targetTasks = [...inProgressTasks.value];
  } else {
    targetTasks = [...doneTasks.value];
  }

  // Update task status if moving to different section
  if (draggedTaskRef.status !== status) {
    draggedTaskRef.status = status;
  }

  // Remove dragged task from current position if it's in the same section
  if (draggedTaskRef.status === status) {
    const currentIndex = targetTasks.findIndex((t) => t.id === draggedTaskRef.id);
    if (currentIndex !== -1) {
      targetTasks.splice(currentIndex, 1);
      if (currentIndex < dropIndex) {
        dropIndex--;
      }
    }
  }

  // Insert at new position
  targetTasks.splice(dropIndex, 0, draggedTaskRef);

  // Update orders
  targetTasks.forEach((task, index) => {
    task.order = index;
  });

  draggedTask.value = null;
  draggedIndex.value = -1;
};

const handleDropInSection = (event: DragEvent, status: Task["status"]) => {
  event.preventDefault();
  event.stopPropagation();

  if (!draggedTask.value) return;

  draggedTask.value.status = status;

  let targetTasks;
  if (status === "todo") {
    targetTasks = todoTasks.value;
  } else if (status === "inprogress") {
    targetTasks = inProgressTasks.value;
  } else {
    targetTasks = doneTasks.value;
  }

  const maxOrder = targetTasks.length > 0 ? Math.max(...targetTasks.map((t) => t.order)) + 1 : 0;

  draggedTask.value.order = maxOrder;
  draggedTask.value = null;
};
</script>
