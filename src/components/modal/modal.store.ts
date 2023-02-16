import { writable } from 'svelte/store';

export interface ModalFields {
  title: boolean;
  description: boolean;
}

export type ModalStore = ReturnType<typeof createModalStore>;

export const createModalStore = (id: string, onClose: () => void) => {
  const modalContext = writable<ModalFields>({ title: false, description: false });

  const getId = () => id;

  const close = () => onClose();

  const markExist = <T extends keyof ModalFields>(field: T) => {
    modalContext.update((modalContextState) => ({
      ...modalContextState,
      [field]: true,
    }));
  };

  const unmarkExist = <T extends keyof ModalFields>(field: T) => {
    modalContext.update((modalContextState) => ({
      ...modalContextState,
      [field]: false,
    }));
  };

  return {
    close,
    subscribe: modalContext.subscribe,
    getId,
    markExist,
    unmarkExist,
  };
};
