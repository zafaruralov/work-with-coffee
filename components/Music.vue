<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- video section -->
    <div class="relative">
      In Test regime
      <div :class="{ hidden: !showVideo }" class="aspect-video bg-black rounded-t-lg overflow-hidden">
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

    <div class="flex gap-2 flex-col">
      <h2 class="text-xl font-bold mb-2 truncate">Lo-fi Study</h2>
      <div class="w-full flex flex-col space-y-1">
        <div class="relative w-full h-5 cursor-pointer flex items-center">
          <div
            data-orientation="horizontal"
            class="flex touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col w-full absolute z-10 pointer-events-none"
          ></div>
        </div>
      </div>
      <div class="flex flex-col items-center space-y-4">
        <div class="flex justify-center items-center space-x-4 mb-4">
          <button
            class="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            aria-label="Previous"
          >
            <NuxtImg :src="`/public/images/previus.svg`" alt="previus" />
          </button>
          <button
            @click="togglePlay"
            class="p-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Play"
          >
            <NuxtImg v-if="isPlaying" src="/public/images/pouse.svg" alt="pouse" />
            <NuxtImg v-else :src="`/public/images/start.svg`" alt="start" />
          </button>
          <button
            class="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            aria-label="Next"
          >
            <NuxtImg :src="`/public/images/previus.svg`" alt="previus" class="rotate-180" />
          </button>
          <div class="flex justify-center">
            <button
              @click="toggleVideo"
              class="px-3 py-1 text-sm rounded-md border border-border bg-muted flex items-center gap-2"
            >
              <NuxtImg :src="`/public/images/video.svg`" alt="video svg" />
              {{ showVideo ? "Hide Video" : "Show Video" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showVideo = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const volume = ref(70);
const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const currentTrackIndex = ref(1);

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

const currentVideoUrl = computed(() => {
  return currentTrack.value.videoUrl || "";
});

function toggleVideo() {
  showVideo.value = !showVideo.value;

  if (showVideo.value) {
    nextTick(() => {
      if (videoRef.value) {
        videoRef.value.load();
      }
    });
  }
}

const onVideoLoaded = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
    videoRef.value.volume = volume.value / 100;
  }
};
const currentTrack = computed(() => {
  return playlist.value[currentTrackIndex.value] || { title: "No Track", videoUrl: "" };
});

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
    isPlaying.value = !videoRef.value.paused;
  }
};

function togglePlay() {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause();
    } else {
      videoRef.value
        .play()
        .then(() => {
          isPlaying.value = true;
        })
        .catch((err) => {
          console.warn("Could not play:", err);
        });
    }
  }
}

const onVideoEnded = () => {
  console.log("finished");
};

onMounted(() => {
  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.load();
    }
  });
});
</script>
