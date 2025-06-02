export interface ModalConfig {
  id: string;
  title: string;
  component?: string;
  isOpen: boolean;
  position: { x: number; y: number };
  isMinimized: boolean;
  zIndex: number;
}
