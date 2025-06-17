import { ReactNode } from "react";

export interface Modals {
    id: string;
    modal: ReactNode;
    outsideModal?: ReactNode;
}

export interface ModalStoreContext {
    modals: Modals[];
    setModals: (modals: { id: string, modal: ReactNode }[]) => void;
    createModal: (modal: ReactNode, outsideModal?: ReactNode) => string;
    closeModal: () => void;
}
