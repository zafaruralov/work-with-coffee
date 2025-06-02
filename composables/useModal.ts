import type { ModalConfig } from "~/types/type";
import { useState, reactive } from "#imports";

export const useModal = () => {
  const modals = useState<ModalConfig[]>("modals", () => []);
  const highestZIndex = ref<number>(100);

  function openModal(id: string, title: string, component?: string) {
    const existing = modals.value.find((m) => m.id === id);

    if (existing) {
      existing.isOpen = true;
      existing.isMinimized = false;
      existing.zIndex = ++highestZIndex.value;
    } else {
      modals.value.push(
        reactive({
          id,
          title,
          component,
          isOpen: true,
          position: { x: 300, y: 300 },
          isMinimized: false,
          zIndex: ++highestZIndex.value
        })
      );
    }
  }

  function closeModal(id: string) {
    const modal = modals.value.find((m) => m.id === id);
    if (modal) {
      modal.isOpen = false;
    }
  }

  function minimizeModal(id: string) {
    const modal = modals.value.find((m) => m.id === id);
    if (modal) {
      modal.isMinimized = !modal.isMinimized;
    }
  }

  function updateModalPosition(id: string, position: { x: number; y: number }) {
    const modal = modals.value.find((m) => m.id === id);
    if (modal) {
      modal.position = position;
    }
  }

  function bringToFront(id: string) {
    const modal = modals.value.find((m) => m.id === id);
    if (modal) {
      modal.zIndex = ++highestZIndex.value;
    }
  }

  const getOpenModals = computed(() => modals.value.filter((modal) => modal.isOpen));

  return {
    modals,
    openModal,
    closeModal,
    minimizeModal,
    updateModalPosition,
    bringToFront,
    getOpenModals
  };
};
