<template>
  <div class="bg-white p-4 flex flex-col justify-start items-center h-full gap-6">
    <div class="flex flex-col gap-2 items-center">
      <span class="text-2xl font-semibold"> {{ currentMode }} </span>
      <div class="text-6xl font-mono mb-6 tabular-nums">
        {{ formattedTime }}
      </div>
      <div class="flex gap-2">
        <button
          @click="toggleTimer"
          class="cursor-pointer px-12 py-2 rounded text-white transition min-w-[120px] bg-primary hover:bg-secondary"
        >
          {{ isRunning ? "Pause" : "Start" }}
        </button>
        <button
          @click="resetTimer"
          class="cursor-pointer px-2 py-2 bg-gray-300 text-secondary rounded hover:bg-background transition"
        >
          reset
        </button>
      </div>
    </div>
    <div class="py-4 w-full flex gap-2 text-center text-xs justify-center max-w-md mx-auto">
      <div class="border px-6 py-2 rounded-md">
        <h1 class="font-semibold text-muted-foreground uppercase tracking-wider">Today</h1>
        <span class="font-semibold text-muted-foreground uppercase tracking-wider"> {{ stats.today.sessions }} </span>
      </div>
      <div class="border px-6 py-2 rounded-md">
        <h1 class="font-semibold text-muted-foreground uppercase tracking-wider">Streak</h1>
        <span class="font-semibold text-muted-foreground uppercase tracking-wider"> {{ stats.streak.days }} </span>
      </div>
      <div class="border px-6 py-2 rounded-md">
        <h1 class="font-semibold text-muted-foreground uppercase tracking-wider">Month</h1>
        <span class="font-semibold text-muted-foreground uppercase tracking-wider"> {{ stats.month.sessions }} </span>
      </div>
    </div>
    <div class="border-t py-4 w-full">
      <h1 class="text-sm font-medium mb-2 text-center">Timer Settings</h1>
      <div class="flex flex-col gap-2 justify-center">
        <label class="flex items-start gap-2 p-2 cursor-pointer rounded hover:bg-gray-100">
          <input
            type="radio"
            name="timerSetting"
            v-model="timerMode"
            value="work"
            class="w-4 h-4 text-amber-600 focus:ring-amber-500"
          />
          <div class="">
            <h1 class="font-medium">Work (25min)</h1>
            <span class="text-xs text-gray-500"> Focus time for maximum productivity. Recorded in session log </span>
          </div>
        </label>
        <label class="flex items-start gap-2 p-2 cursor-pointer rounded hover:bg-gray-100">
          <input
            type="radio"
            name="timerSetting"
            v-model="timerMode"
            value="shortBreak"
            class="w-4 h-4 text-amber-600 focus:ring-amber-500"
          />
          <div class="">
            <h1 class="font-medium">Short Break (5min)</h1>
            <span class="text-xs text-gray-500"> Quick refreshment between work sessions </span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Stats {
  today: {
    sessions: number;
    time: string;
  };
  streak: {
    days: number;
  };
  month: {
    sessions: number;
    time: string;
  };
}
const timerMode = ref<"work" | "shortBreak">("work");
const timeLeft = ref(25 * 60);
const isRunning = ref(false);
const timer = ref<NodeJS.Timeout | null>(null);
const sound = ref<HTMLAudioElement | null>(null);
const volume = ref(0.7);

const stats = ref<Stats>({
  today: {
    sessions: 0,
    time: "0m"
  },
  streak: {
    days: 0
  },
  month: {
    sessions: 0,
    time: "0m"
  }
});
const currentMode = computed(() => {
  return timerMode.value === "work" ? "Work" : "Short Break";
});
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const getTimerDuration = () => {
  return timerMode.value === "work" ? 25 * 60 : 5 * 60;
};

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer();
  } else {
    startTimer();
  }
};

const startTimer = () => {
  isRunning.value = true;
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      completeSession();
    }
  }, 1000);
};

const pauseTimer = () => {
  isRunning.value = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const resetTimer = () => {
  pauseTimer();
  timeLeft.value = getTimerDuration();
};

const completeSession = () => {
  pauseTimer();

  if (sound.value) {
    sound.value.volume = volume.value;
    sound.value.currentTime = 0;
    sound.value.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  if (timerMode.value === "work") {
    stats.value.today.sessions++;
    stats.value.month.sessions++;
  }

  resetTimer();
};

const updateTimerMode = () => {
  resetTimer();
};

function stopSound() {
  if (sound.value) {
    sound.value.pause();
    sound.value.currentTime = 0;
    sound.value.src = "";
    sound.value.load();
    sound.value = null;
  }
}

onMounted(() => {
  timeLeft.value = getTimerDuration();
  sound.value = new Audio("/godzilla-roars-59572.mp3");
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
  stopSound();
});

watch(timerMode, updateTimerMode);
</script>
