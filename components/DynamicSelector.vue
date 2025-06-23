<template>
  <div class="relative w-full" ref="selectorRef">
    <div
      :class="[
        'relative flex items-center min-h-[2.5rem] px-3 py-2 border rounded-lg cursor-pointer transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-[#a65330] focus-within:border-[#a65330]',
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white hover:border-gray-400',
        error ? 'border-red-500' : 'border-gray-300',
        customClasses?.container || ''
      ]"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      tabindex="0"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      role="combobox"
    >
      <div class="flex-1 flex flex-wrap gap-1 min-h-[24px]">
        <template v-if="multiple && selectedItems.length > 0">
          <div
            v-for="item in selectedItems"
            :key="getItemKey(item)"
            :class="[
              'inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md',
              'bg-blue-100 text-blue-800 border border-blue-200',
              customClasses?.tag || ''
            ]"
          >
            <slot name="tag" :item="item" :remove="() => removeItem(item)">
              <span>{{ getDisplayValue(item) }}</span>
              <button
                @click.stop="removeItem(item)"
                class="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                :aria-label="`Remove ${getDisplayValue(item)}`"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </slot>
          </div>
        </template>

        <template v-else-if="!multiple && selectedItems.length > 0">
          <slot name="selected" :item="selectedItems[0]">
            <span class="text-gray-900">{{ getDisplayValue(selectedItems[0]) }}</span>
          </slot>
        </template>

        <span v-else :class="['text-gray-500', customClasses?.placeholder || '']">
          {{ placeholder }}
        </span>

        <input
          v-if="searchable && isOpen"
          ref="searchInput"
          v-model="searchQuery"
          :class="['flex-1 min-w-[100px] outline-none bg-transparent', customClasses?.searchInput || '']"
          :placeholder="searchPlaceholder"
          @click.stop
          @keydown.stop="handleSearchKeydown"
        />
      </div>

      <div v-if="loading" class="ml-2">
        <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <button
        v-if="clearable && selectedItems.length > 0 && !disabled"
        @click.stop="clearSelection"
        class="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        :aria-label="'Clear selection'"
      >
        <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div class="ml-2">
        <svg
          :class="['w-4 h-4 text-gray-400 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :class="[
          'absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto',
          customClasses?.dropdown || ''
        ]"
        :style="dropdownStyle"
        role="listbox"
        :aria-multiselectable="multiple"
      >
        <div
          v-if="
            creatable &&
            searchQuery &&
            !filteredOptions.some((opt) => getDisplayValue(opt).toLowerCase() === searchQuery.toLowerCase())
          "
          :class="[
            'px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100',
            'text-blue-600 font-medium',
            customClasses?.createOption || ''
          ]"
          @click="createNewOption"
          role="option"
        >
          <slot name="create" :query="searchQuery"> Create "{{ searchQuery }}" </slot>
        </div>

        <div
          v-for="(option, index) in filteredOptions"
          :key="getItemKey(option)"
          :class="[
            'px-3 py-2 cursor-pointer transition-colors duration-150',
            'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
            isSelected(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-900',
            highlightedIndex === index ? 'bg-gray-100' : '',
            customClasses?.option || ''
          ]"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
          role="option"
          :aria-selected="isSelected(option)"
          tabindex="-1"
        >
          <slot name="option" :option="option" :selected="isSelected(option)" :index="index">
            <div class="flex items-center justify-between">
              <span>{{ getDisplayValue(option) }}</span>
              <svg v-if="isSelected(option)" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </slot>
        </div>

        <div
          v-if="filteredOptions.length === 0 && !loading"
          :class="['px-3 py-2 text-gray-500 text-center', customClasses?.noOptions || '']"
        >
          <slot name="no-options" :query="searchQuery">
            {{ searchQuery ? "No options found" : "No options available" }}
          </slot>
        </div>

        <div v-if="loading" class="px-3 py-2 text-gray-500 text-center flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <slot name="loading">Loading...</slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = Record<string, any>">
interface Props {
  modelValue?: T | T[] | null;
  options?: T[];
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;

  placeholder?: string;
  searchPlaceholder?: string;
  displayKey?: keyof T | ((item: T) => string);
  valueKey?: keyof T | ((item: T) => any);

  searchable?: boolean;
  clearable?: boolean;
  creatable?: boolean;

  error?: string;

  customClasses?: {
    container?: string;
    dropdown?: string;
    option?: string;
    tag?: string;
    placeholder?: string;
    searchInput?: string;
    createOption?: string;
    noOptions?: string;
  };

  loadOptions?: (query: string) => Promise<T[]>;
  debounceMs?: number;
}

interface Emits {
  "update:modelValue": [value: T | T[] | null];
  search: [query: string];
  create: [value: string];
  open: [];
  close: [];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option...",
  searchPlaceholder: "Search...",
  displayKey: "label" as any,
  valueKey: "value" as any,
  multiple: false,
  searchable: true,
  clearable: true,
  creatable: false,
  disabled: false,
  loading: false,
  debounceMs: 300
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const searchQuery = ref("");
const highlightedIndex = ref(-1);
const selectorRef = ref<HTMLElement>();
const dropdownRef = ref<HTMLElement>();
const searchInput = ref<HTMLInputElement>();
const dropdownStyle = ref({});

const selectedItems = computed(() => {
  if (!props.modelValue) return [];
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
});

const filteredOptions = computed(() => {
  if (!props.options) return [];

  if (!searchQuery.value) return props.options;

  const query = searchQuery.value.toLowerCase();
  return props.options.filter((option) => getDisplayValue(option).toLowerCase().includes(query));
});

const getDisplayValue = (item: T): string => {
  if (typeof props.displayKey === "function") {
    return props.displayKey(item);
  }
  return String(item[props.displayKey] || item);
};

const getItemValue = (item: T): any => {
  if (typeof props.valueKey === "function") {
    return props.valueKey(item);
  }
  return item[props.valueKey] || item;
};

const getItemKey = (item: T): string => {
  return String(getItemValue(item));
};

const isSelected = (option: T): boolean => {
  return selectedItems.value.some((selected) => getItemValue(selected) === getItemValue(option));
};

const selectOption = (option: T) => {
  if (props.multiple) {
    const currentSelection = selectedItems.value;
    const isCurrentlySelected = isSelected(option);

    let newSelection: T[];
    if (isCurrentlySelected) {
      newSelection = currentSelection.filter((item) => getItemValue(item) !== getItemValue(option));
    } else {
      newSelection = [...currentSelection, option];
    }

    emit("update:modelValue", newSelection);
  } else {
    emit("update:modelValue", option);
    closeDropdown();
  }
};

const removeItem = (item: T) => {
  if (props.multiple) {
    const newSelection = selectedItems.value.filter((selected) => getItemValue(selected) !== getItemValue(item));
    emit("update:modelValue", newSelection);
  }
};

const clearSelection = () => {
  emit("update:modelValue", props.multiple ? [] : null);
};

const createNewOption = () => {
  emit("create", searchQuery.value);
  searchQuery.value = "";
};

// Dropdown methods
const toggleDropdown = () => {
  if (props.disabled) return;

  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const openDropdown = () => {
  if (props.disabled) return;

  isOpen.value = true;
  highlightedIndex.value = -1;

  nextTick(() => {
    updateDropdownPosition();
    if (props.searchable && searchInput.value) {
      searchInput.value.focus();
    }
  });

  emit("open");
};

const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = "";
  highlightedIndex.value = -1;
  emit("close");
};

const updateDropdownPosition = () => {
  if (!selectorRef.value || !dropdownRef.value) return;

  const rect = selectorRef.value.getBoundingClientRect();
  const dropdownHeight = dropdownRef.value.offsetHeight;
  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;

  const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

  dropdownStyle.value = {
    position: "fixed",
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    top: shouldOpenUpward ? `${rect.top - dropdownHeight}px` : `${rect.bottom}px`,
    zIndex: 9999
  };
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else if (highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else {
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1);
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (isOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      }
      break;
  }
};

const handleSearchKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "Enter":
      event.preventDefault();
      if (highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value]);
      } else if (props.creatable && searchQuery.value) {
        createNewOption();
      }
      break;
    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
  }
};

let searchTimeout: NodeJS.Timeout;
const debouncedSearch = (query: string) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emit("search", query);
    if (props.loadOptions) {
      props.loadOptions(query);
    }
  }, props.debounceMs);
};

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const handleClickOutside = (event: Event) => {
  if (
    isOpen.value &&
    selectorRef.value &&
    dropdownRef.value &&
    !selectorRef.value.contains(event.target as Node) &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateDropdownPosition);
  window.addEventListener("scroll", updateDropdownPosition);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", updateDropdownPosition);
  window.removeEventListener("scroll", updateDropdownPosition);
  clearTimeout(searchTimeout);
});

watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(updateDropdownPosition);
  }
});
</script>
