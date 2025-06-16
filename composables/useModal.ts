import type { ModalConfig } from "~/types/type";

export const useModal = () => {
  const modals = useState<ModalConfig[]>("modals", () => []);
  const highestZIndex = ref<number>(100);

  function openModal(id: string, title: string, component: string) {
    const existing = modals.value.find((m) => m.id === id);

    if (existing) {
      existing.isOpen = true;
      existing.isMinimized = false;
      existing.zIndex = ++highestZIndex.value;
    } else {
      const offset = modals.value.length * 50;

      modals.value.push(
        reactive({
          id,
          title,
          component,
          isOpen: true,
          position: { x: offset, y: offset },
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
    const index = modals.value.findIndex((m) => m.id === id);
    if (index === -1) return;
    const modal = modals.value.splice(index, 1)[0];
    modals.value.push(modal);
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
