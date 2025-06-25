<template>
  <div class="flex flex-col items-center justify-start text-secondary h-full p-4 shadow-lg rounded-xl">
    <div class="w-full flex flex-col gap-8">
      <div
        class="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 gap-2"
      >
        <div
          data-state="active"
          class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex items-center min-w-fit gap-2 data-[state=active]:bg-[#a65330] data-[state=active]:text-white"
        >
          Background
        </div>
        <div
          data-state="inactive"
          class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex items-center min-w-fit gap-2 data-[state=active]:bg-[#a65330] data-[state=active]:text-white"
        >
          Sound
        </div>
      </div>
      <div class="flex flex-col gap-8 items-center justify-start text-secondary h-full">
        <div>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4 w-full">
            <div
              class="cursor-pointer border-2 transition-colors border-muted hover:border-primary/50 bg-muted rounded-md overflow-hidden flex items-center justify-center h-[60px] sm:h-[70px]"
              role="button"
              tabindex="0"
              @click="removeImage"
            >
              <div class="text-center text-xs sm:text-sm font-medium">No Image</div>
            </div>
            <div
              class="cursor-pointer border-2 transition-colors relative border-primary rounded-md overflow-hidden flex items-center justify-center h-[60px] sm:h-[70px]"
              role="button"
              tabindex="0"
              @click="$refs.fileInput.click()"
            >
              <template v-if="uploadedImage">
                <img
                  :src="uploadedImage"
                  alt="Uploaded Background"
                  decoding="async"
                  class="object-cover opacity-80 transition-opacity"
                  style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent"
                />
              </template>
              <template v-else>
                <span class="text-sm font-medium text-muted-foreground z-10">+ Upload</span>
              </template>
              <input ref="fileInput" accept="image/*" class="hidden" type="file" @change="handleFileUpload" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            <div
              v-for="image in backgroundImage"
              :key="image.id"
              @click="iconToggle(image.url)"
              :class="tempSelectedImage === image.url ? 'outline' : 'border-transparent hover:border-gray-300'"
              class="cursor-pointer transition-colors rounded-md overflow-hidden aspect-video"
            >
              <img :src="image.url" alt="Background option" class="object-cover w-full h-full" />

              <!-- ToDo do i really need it? -->
            </div>
          </div>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium mb-2" for="fit-selector">Image Fit</label>
          <div class="relative">
            <select
              v-model="tempSelectedFit"
              class="border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full"
            >
              <option v-for="option in fitOptions" :key="option" :value="option">
                {{ option.charAt(0).toUpperCase() + option.slice(1) }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 w-full mt-4">
          <button
            @click="handleClose"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button @click="apply" class="px-4 py-2 bg-[#a65330] text-white rounded-md hover:bg-[#8a4529] cursor-pointer">
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ModalConfig } from "~/types/type";

const { selectedImage, selectedFit, backgroundImage, fitOptions } = useBackground();

const props = defineProps<{
  modalConfig: ModalConfig;
}>();
const { closeModal } = useModal();

const tempSelectedImage = ref(selectedImage.value);
const tempSelectedFit = ref(selectedFit.value);
const uploadedImage = ref<string | null>(null);
const clickCount = ref(0);

let clickTimer: ReturnType<typeof setTimeout> | null = null;

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        uploadedImage.value = e.target.result as string;
        tempSelectedImage.value = e.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  }
};
const iconToggle = (val: string) => {
  clickCount.value++;

  // if (clickTimer) {
  //   clearTimeout(clickTimer);
  // }

  clickTimer = setTimeout(() => {
    clickCount.value = 0;
    clickTimer = null;
  }, 5000);

  if (clickCount.value === 3) {
    tempSelectedImage.value = "/images/girl-on-back.jpg";
    clickCount.value = 0;
    selectedFit.value = "fit";

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
  } else {
    tempSelectedImage.value = val;
  }

  apply();
};
const removeImage = () => {
  selectedImage.value = "";
};

const handleClose = () => {
  closeModal(props.modalConfig.id);
};

const apply = () => {
  selectedImage.value = tempSelectedImage.value;
  selectedFit.value = tempSelectedFit.value;
};
</script>
