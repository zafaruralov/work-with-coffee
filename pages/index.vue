<script setup lang="ts">
const { selectedImage, selectedFit, backgroundStyle, backgroundImage, fitOptions } = useBackground();
</script>

<template>
  <div class="fixed inset-0 w-full h-full -z-20 transition-all duration-500" :style="backgroundStyle"></div>
  <div class="h-full w-full flex flex-col p-4 md:p-5 lg:p-6">
    <TopbarActions />
    <TopbarMenu />
  </div>
</template>
