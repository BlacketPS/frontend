import { ReactNode } from "react";

export interface Modals {
    id: string;
    modal: ReactNode;
    outsideModal?: ReactNode;
}

export interface ModalStore {
    modals: Modals[];
    setModals: (modals: Modals[]) => void;
    createModal: (modal: ReactNode, outsideModal?: ReactNode) => string;
    closeModal: () => void;
    closing: boolean;
    setClosing: (closing: boolean) => void;
}
