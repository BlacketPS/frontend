import { create } from "zustand";

import { ModalStore } from "./modalStore.d";

export const useModal = create<ModalStore>((set, get) => ({
    modals: [],

    setModals: (modals) => set({ modals }),

    createModal: (modal, outsideModal) => {
        const id = Math.random().toString(36).slice(2);

        set((s) => ({ modals: [...s.modals, { id, modal, outsideModal }] }));

        return id;
    },

    closeModal: () => {
        if (localStorage.getItem("DISABLE_MODAL_ANIMATION") === "true") {
            set((s) => ({ modals: s.modals.slice(1) }));
        } else {
            set({ closing: true });
        }
    },

    closing: false,

    setClosing: (c) => set({ closing: c })
}));
