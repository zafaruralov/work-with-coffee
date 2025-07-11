<script setup lang="ts">
import { ref, onMounted } from "vue";
const { selectedImage, selectedFit, backgroundStyle, backgroundImage, fitOptions } = useBackground();

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
    console.log(isLoading.value);
  }, 4750);
});
</script>

<template>
  <div class="circle" v-if="isLoading">
    {{ isLoading }}
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div class="final"></div>
  </div>
  <div v-else>
    <div class="fixed inset-0 w-full h-full -z-20 transition-all duration-500" :style="backgroundStyle"></div>

    <div class="h-screen w-full flex flex-col p-4 md:p-5 lg:p-6 pb-0">
      <TopbarActions />
      <TopbarMenu />
    </div>
  </div>
</template>

<style>
.circle {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #a65330;
}

.circle div {
  position: absolute;
  top: calc((50% - 10px));
  left: calc((50% - 10px));
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
}

.circle div:nth-child(1) {
  animation: anim_01 2s forwards;
}
.circle div:nth-child(2) {
  animation: move_01 2s 2s;
}
.circle div:nth-child(4) {
  animation: move_03 2s 2s;
}
.circle div:nth-child(3) {
  animation: move_02 2s 2s;
}
.circle div:nth-child(5) {
  animation: move_04 2s 2s;
}

.circle .final {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: final_burst 1.2s ease-out 4s forwards;
  z-index: 10;
  visibility: hidden;
  pointer-events: none;
}
@keyframes final_burst {
  0% {
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(100);
    opacity: 0;
  }
}
</style>
