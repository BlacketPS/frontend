import { ReactNode } from "react";

export interface Modals {
    id: string;
    modal: ReactNode;
}

export interface ModalStoreContext {
    modals: Modals[];
    setModals: (modals: { id: string, modal: ReactNode }[]) => void;
    createModal: (modal: ReactNode) => string;
    closeModal: () => void;
}
