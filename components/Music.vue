<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
    <!-- YouTube Video Section (conditionally rendered) -->
    <div v-if="showVideo" class="mb-4">
      <iframe
        :src="activeVideo ? `https://www.youtube.com/embed/${getYoutubeId(activeVideo)}?autoplay=1&enablejsapi=1` : ''"
        class="w-full rounded-lg aspect-video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Player Title -->
    <h1 class="text-2xl font-bold mb-4">Lo-fi Study</h1>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="relative h-1 bg-gray-200 rounded-full">
        <div class="absolute h-1 bg-amber-500 rounded-full" :style="{ width: `${progress}%` }"></div>
        <div
          class="absolute h-4 w-4 bg-amber-500 rounded-full -top-1.5 border-2 border-white"
          :style="{ left: `calc(${progress}% - 8px)` }"
          @mousedown="startDragging"
        ></div>
      </div>
      <div class="flex justify-between text-sm text-gray-600 mt-1">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- Playback Controls -->
    <div class="flex justify-center space-x-4 mb-4">
      <button
        @click="previousTrack"
        class="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center text-white hover:bg-amber-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        @click="togglePlay"
        class="w-14 h-14 bg-amber-900 rounded-full flex items-center justify-center text-white hover:bg-amber-800"
      >
        <svg
          v-if="!isPlaying"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button
        @click="nextTrack"
        class="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center text-white hover:bg-amber-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Video Toggle Button -->
    <div class="flex justify-center mb-4">
      <button
        @click="toggleVideo"
        class="flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {{ showVideo ? "Hide Video" : "Show Video" }}
      </button>
    </div>

    <!-- Volume Control -->
    <div class="flex items-center space-x-2 mb-6">
      <button @click="toggleMute" class="text-gray-600">
        <svg
          v-if="!isMuted"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      </button>
      <div class="relative flex-1 h-1 bg-gray-200 rounded-full">
        <div class="absolute h-1 bg-amber-800 rounded-full" :style="{ width: `${volume}%` }"></div>
        <div
          class="absolute h-4 w-4 bg-amber-500 rounded-full -top-1.5 border-2 border-white"
          :style="{ left: `calc(${volume}% - 8px)` }"
          @mousedown="startVolumeChange"
        ></div>
      </div>
      <span class="text-sm text-gray-600">{{ volume }}%</span>
    </div>

    <!-- YouTube URL Input -->
    <div class="flex mb-6">
      <input
        v-model="youtubeUrl"
        type="text"
        placeholder="Enter YouTube URL"
        class="flex-1 px-4 py-2 bg-gray-100 rounded-l-lg focus:outline-none"
      />
      <button @click="addToPlaylist" class="bg-amber-700 text-white px-4 py-2 rounded-r-lg hover:bg-amber-600">
        +
      </button>
    </div>

    <!-- Playlist Section -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold">Playlist</h2>
        <button class="text-sm text-gray-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          Sorted by Title
        </button>
      </div>
      <div class="max-h-60 overflow-y-auto">
        <div
          v-for="(item, index) in playlist"
          :key="index"
          class="flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50"
          :class="{ 'bg-amber-50': activeIndex === index }"
          @click="playTrack(index)"
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span>{{ item.title }}</span>
          </div>
          <div class="flex space-x-2">
            <button @click.stop="editTrack(index)" class="text-gray-400 hover:text-amber-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button @click.stop="removeTrack(index)" class="text-gray-400 hover:text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

// State
const showVideo = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(3674); // 1:01:14 in seconds
const volume = ref(70);
const youtubeUrl = ref("");
const isDragging = ref(false);
const isVolumeChanging = ref(false);
const activeIndex = ref(0);

// Initial playlist
const playlist = ref([
  { title: "Cozy Room", url: "https://www.youtube.com/watch?v=DbuebKNKQsQ" },
  { title: "FKJ Live", url: "https://www.youtube.com/watch?v=sCNlt5nvSI8" },
  { title: "Ghibli Piano", url: "https://www.youtube.com/watch?v=7LEmer7wwHI" },
  { title: "Jazzjeans", url: "https://www.youtube.com/watch?v=6uddGul0oAc" }
]);

// Computed properties
const progress = computed(() => {
  return (currentTime.value / duration.value) * 100;
});

const activeVideo = computed(() => {
  return playlist.value[activeIndex.value]?.url || "";
});

// Methods
const toggleVideo = () => {
  showVideo.value = !showVideo.value;
};

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;

  if (isPlaying.value) {
    // Start progress simulation
    startProgressSimulation();
  } else {
    // Stop progress simulation
    stopProgressSimulation();
  }
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    volume.value = 0;
  } else {
    volume.value = 70;
  }
};

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let result = "";
  if (hrs > 0) {
    result += `${hrs}:${mins < 10 ? "0" : ""}`;
  }
  result += `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  return result;
};

const startDragging = (e: MouseEvent) => {
  isDragging.value = true;
  document.addEventListener("mousemove", handleProgressDrag);
  document.addEventListener("mouseup", stopDragging);
  handleProgressDrag(e);
};

const handleProgressDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const progressBar = e.target.parentElement;
  const rect = progressBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const percentage = (x / rect.width) * 100;

  currentTime.value = (percentage / 100) * duration.value;
};

const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleProgressDrag);
  document.removeEventListener("mouseup", stopDragging);
};

const startVolumeChange = (e: MouseEvent) => {
  isVolumeChanging.value = true;
  document.addEventListener("mousemove", handleVolumeChange);
  document.addEventListener("mouseup", stopVolumeChange);
  handleVolumeChange(e);
};

const handleVolumeChange = (e: MouseEvent) => {
  if (!isVolumeChanging.value) return;

  const volumeBar = e.target.parentElement;
  const rect = volumeBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const percentage = Math.round((x / rect.width) * 100);

  volume.value = percentage;
  if (percentage > 0) {
    isMuted.value = false;
  } else {
    isMuted.value = true;
  }
};

const stopVolumeChange = () => {
  isVolumeChanging.value = false;
  document.removeEventListener("mousemove", handleVolumeChange);
  document.removeEventListener("mouseup", stopVolumeChange);
};

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const addToPlaylist = () => {
  if (!youtubeUrl.value) return;

  const videoId = getYoutubeId(youtubeUrl.value);
  if (!videoId) {
    alert("Please enter a valid YouTube URL");
    return;
  }

  // For simplicity, we'll just use the URL as the title
  // In a real app, you might want to fetch the actual video title
  const title = `YouTube Video ${playlist.value.length + 1}`;

  playlist.value.push({
    title,
    url: youtubeUrl.value
  });

  youtubeUrl.value = "";
};

const playTrack = (index: number) => {
  activeIndex.value = index;
  currentTime.value = 0;
  isPlaying.value = true;
  startProgressSimulation();
};

const previousTrack = () => {
  activeIndex.value = (activeIndex.value - 1 + playlist.value.length) % playlist.value.length;
  currentTime.value = 0;
  if (isPlaying.value) {
    startProgressSimulation();
  }
};

const nextTrack = () => {
  activeIndex.value = (activeIndex.value + 1) % playlist.value.length;
  currentTime.value = 0;
  if (isPlaying.value) {
    startProgressSimulation();
  }
};

const editTrack = (index: number) => {
  const newTitle = prompt("Enter new title:", playlist.value[index].title);
  if (newTitle) {
    playlist.value[index].title = newTitle;
  }
};

const removeTrack = (index: number) => {
  playlist.value.splice(index, 1);
  if (playlist.value.length === 0) {
    isPlaying.value = false;
    currentTime.value = 0;
    stopProgressSimulation();
  } else if (index === activeIndex.value) {
    activeIndex.value = 0;
    currentTime.value = 0;
    if (isPlaying.value) {
      startProgressSimulation();
    }
  } else if (index < activeIndex.value) {
    activeIndex.value--;
  }
};

// Progress simulation
let progressInterval: number | null = null;

const startProgressSimulation = () => {
  stopProgressSimulation();
  progressInterval = setInterval(() => {
    currentTime.value += 1;
    if (currentTime.value >= duration.value) {
      nextTrack();
    }
  }, 1000);
};

const stopProgressSimulation = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Initialize with a random starting time for demo purposes
  currentTime.value = Math.floor(Math.random() * 60);
});

onUnmounted(() => {
  stopProgressSimulation();
});
</script>
