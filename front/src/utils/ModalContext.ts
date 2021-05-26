import {createContext, ReactElement, useContext} from 'react';

export type ModalElement = ReactElement;

interface ModalContextType {
  isShowing: boolean,
  setAsModal: (modal: ModalElement) => void
  clear: () => void,
}

export const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const useModalContext = (): ModalContextType => {
  return useContext(ModalContext);
};
