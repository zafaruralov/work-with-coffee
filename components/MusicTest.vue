<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Video Section (conditionally rendered) -->
    <div v-if="showVideo" class="relative">
      <div class="aspect-video bg-black rounded-t-lg overflow-hidden">
        <video
          ref="videoRef"
          class="w-full h-full object-cover"
          @loadedmetadata="onVideoLoaded"
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
          controls
          preload="metadata"
        >
          <source :src="currentVideoUrl" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>

    <!-- Main Player Section -->
    <div class="p-6">
      <!-- Track Title -->
      <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ currentTrack.title }}</h2>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 bg-amber-600 rounded-full flex-shrink-0"></div>
          <div
            class="flex-1 bg-gray-200 rounded-full h-2 cursor-pointer relative"
            @click="handleProgressClick"
            ref="progressBarRef"
          >
            <div
              class="bg-amber-600 h-2 rounded-full transition-all duration-150"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
            <!-- Progress handle -->
            <div
              class="absolute top-1/2 w-4 h-4 bg-amber-600 rounded-full transform -translate-y-1/2 cursor-pointer"
              :style="{ left: `calc(${progressPercentage}% - 8px)` }"
              @mousedown="startProgressDrag"
            ></div>
          </div>
        </div>
        <div class="flex justify-between text-sm text-gray-500 mt-2">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex justify-center items-center space-x-4 mb-6">
        <button
          @click="previousTrack"
          class="w-12 h-12 bg-amber-700 hover:bg-amber-800 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          @click="togglePlay"
          class="w-14 h-14 bg-amber-800 hover:bg-amber-900 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg v-if="!isPlaying" class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <button
          @click="nextTrack"
          class="w-12 h-12 bg-amber-700 hover:bg-amber-800 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      <!-- Show/Hide Video Button -->
      <div class="flex justify-center mb-6">
        <button
          @click="toggleVideo"
          class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
            />
          </svg>
          <span class="text-sm font-medium">{{ showVideo ? "Hide Video" : "Show Video" }}</span>
        </button>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-3 mb-6">
        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
          />
        </svg>
        <div
          class="flex-1 bg-gray-300 rounded-full h-2 cursor-pointer relative"
          @click="handleVolumeClick"
          ref="volumeBarRef"
        >
          <div class="bg-amber-700 h-2 rounded-full" :style="{ width: `${volume}%` }"></div>
          <div
            class="absolute top-1/2 w-4 h-4 bg-amber-700 rounded-full transform -translate-y-1/2 cursor-pointer"
            :style="{ left: `calc(${volume}% - 8px)` }"
            @mousedown="startVolumeDrag"
          ></div>
        </div>
        <span class="text-sm text-gray-600 w-8">{{ volume }}%</span>
      </div>

      <!-- URL Input -->
      <div class="flex space-x-2 mb-6">
        <input
          v-model="youtubeUrl"
          type="text"
          placeholder="Enter video URL"
          class="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button
          @click="addToPlaylist"
          class="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors"
        >
          +
        </button>
      </div>

      <!-- Playlist Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-gray-800">Playlist</h3>
        <button class="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
          </svg>
          <span>Sort</span>
        </button>
      </div>

      <!-- Playlist Items -->
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div
          v-for="(track, index) in playlist"
          :key="index"
          class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          :class="{ 'bg-amber-50 border border-amber-200': currentTrackIndex === index }"
        >
          <!-- Drag Handle -->
          <svg class="w-4 h-4 text-gray-400 cursor-move" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>

          <!-- Play Button -->
          <button @click="playTrack(index)" class="w-6 h-6 flex items-center justify-center">
            <svg
              v-if="currentTrackIndex === index && isPlaying"
              class="w-4 h-4 text-amber-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <svg v-else class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <!-- Track Title -->
          <span
            class="flex-1 text-sm cursor-pointer"
            :class="{ 'text-amber-700 font-medium': currentTrackIndex === index }"
            @click="playTrack(index)"
          >
            {{ track.title }}
          </span>

          <!-- Action Buttons -->
          <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-1 hover:bg-gray-200 rounded">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
            </button>
            <button @click="removeTrack(index)" class="p-1 hover:bg-gray-200 rounded">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

// Reactive data
const showVideo = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70);
const youtubeUrl = ref("");
const currentTrackIndex = ref(1);
const progressBarRef = ref(null);
const volumeBarRef = ref(null);
const videoRef = ref(null);

const playlist = ref([
  {
    title: "Cozy Room",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    title: "FKJ Live",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    title: "Ghibli Piano",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    title: "Jazzjeans",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
]);

// Computed properties
const currentTrack = computed(() => {
  return playlist.value[currentTrackIndex.value] || { title: "No Track", videoUrl: "" };
});

const currentVideoUrl = computed(() => {
  return currentTrack.value.videoUrl || "";
});

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Video event handlers
const onVideoLoaded = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
    videoRef.value.volume = volume.value / 100;
  }
};

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
    isPlaying.value = !videoRef.value.paused;
  }
};

const onVideoEnded = () => {
  nextTrack();
};

// Methods
const toggleVideo = () => {
  showVideo.value = !showVideo.value;
  if (showVideo.value) {
    nextTick(() => {
      if (videoRef.value) {
        videoRef.value.load();
      }
    });
  }
};

const togglePlay = () => {
  if (showVideo.value && videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause();
    } else {
      videoRef.value.play();
    }
  } else {
    isPlaying.value = !isPlaying.value;
  }
};

const previousTrack = () => {
  if (currentTrackIndex.value > 0) {
    currentTrackIndex.value--;
  } else {
    currentTrackIndex.value = playlist.value.length - 1;
  }
  loadCurrentTrack();
};

const nextTrack = () => {
  if (currentTrackIndex.value < playlist.value.length - 1) {
    currentTrackIndex.value++;
  } else {
    currentTrackIndex.value = 0;
  }
  loadCurrentTrack();
};

const playTrack = (index) => {
  currentTrackIndex.value = index;
  loadCurrentTrack();
  if (showVideo.value && videoRef.value) {
    videoRef.value.play();
  } else {
    isPlaying.value = true;
  }
};

const loadCurrentTrack = () => {
  currentTime.value = 0;
  if (showVideo.value && videoRef.value) {
    videoRef.value.load();
  }
};

const removeTrack = (index) => {
  if (playlist.value.length <= 1) return;

  playlist.value.splice(index, 1);
  if (currentTrackIndex.value >= index && currentTrackIndex.value > 0) {
    currentTrackIndex.value--;
  } else if (currentTrackIndex.value >= playlist.value.length) {
    currentTrackIndex.value = playlist.value.length - 1;
  }
  loadCurrentTrack();
};

const addToPlaylist = () => {
  if (youtubeUrl.value.trim()) {
    playlist.value.push({
      title: `New Track ${playlist.value.length + 1}`,
      videoUrl: youtubeUrl.value.trim()
    });
    youtubeUrl.value = "";
  }
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const handleProgressClick = (event) => {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;
  const newTime = percentage * duration.value;

  if (showVideo.value && videoRef.value) {
    videoRef.value.currentTime = newTime;
  } else {
    currentTime.value = newTime;
  }
};

const handleVolumeClick = (event) => {
  const volumeBar = event.currentTarget;
  const rect = volumeBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;

  volume.value = Math.max(0, Math.min(100, Math.floor(percentage * 100)));

  if (showVideo.value && videoRef.value) {
    videoRef.value.volume = volume.value / 100;
  }
};

const startProgressDrag = (event) => {
  event.preventDefault();
  const handleMouseMove = (e) => {
    const progressBar = progressBarRef.value;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = percentage * duration.value;

    if (showVideo.value && videoRef.value) {
      videoRef.value.currentTime = newTime;
    } else {
      currentTime.value = newTime;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const startVolumeDrag = (event) => {
  event.preventDefault();
  const handleMouseMove = (e) => {
    const volumeBar = volumeBarRef.value;
    if (!volumeBar) return;

    const rect = volumeBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;

    volume.value = Math.floor(percentage * 100);

    if (showVideo.value && videoRef.value) {
      videoRef.value.volume = volume.value / 100;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
</script>

<style scoped>
/* Custom scrollbar for playlist */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
