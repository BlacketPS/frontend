import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Modal } from "@components/index";

import { Modals, type ModalStoreContext } from "./modal.d";

const ModalStoreContext = createContext<ModalStoreContext>({
    modals: [],
    setModals: () => { },
    createModal: () => "",
    closeModal: () => { }
});

export function useModal() {
    return useContext(ModalStoreContext);
}

export function ModalStoreProvider({ children }: { children: ReactNode }) {
    const [modals, setModals] = useState<Modals[]>([]);
    const [closing, setClosing] = useState<boolean>(false);

    const createModal = (modal: ReactNode, outsideModal?: ReactNode) => {
        const id = Math.random().toString(36).slice(2);

        setModals((modals) => [...modals, { id, modal, outsideModal }]);

        return id;
    };

    const closeModal = () => {
        if (localStorage.getItem("DISABLE_MODAL_ANIMATION") === "true") return setModals((modals: Modals[]) => modals.filter((_: unknown, i: number) => i !== 0));

        setClosing(true);
        setTimeout(() => {
            setModals((modals: Modals[]) => modals.filter((_: unknown, i: number) => i !== 0));
            setClosing(false);
        }, 500);
    };

    useEffect(() => {
        if (modals.length > 0) document.body.style.overflow = "hidden";
        else document.body.style.removeProperty("overflow");
    }, [modals]);

    return (
        <ModalStoreContext.Provider value={{ modals, setModals, createModal, closeModal }}>
            {modals[0] && (
                <Modal.GenericModal closing={closing} noAnimation={localStorage.getItem("DISABLE_MODAL_ANIMATION") === "true"} outside={modals[0].outsideModal}>
                    {modals[0].modal}
                </Modal.GenericModal>
            )}

            {children}
        </ModalStoreContext.Provider>
    );
}
