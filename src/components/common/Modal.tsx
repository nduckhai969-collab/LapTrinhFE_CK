import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children?: ReactNode;
}

const Modal = (_props: ModalProps) => {
  return null;
};

export default Modal;
