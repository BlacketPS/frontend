import { create } from "zustand";

import { ToastStore } from "./toast.d";

export const useToast = create<ToastStore>((set, get) => ({
    toasts: [],

    setToasts: (toasts) => set({ toasts }),

    createToast: (toast) => {
        const id = toast.id || Math.random().toString(36).substring(7);
        const expires = toast.expires || 5000;
        set((state) => ({ toasts: [...state.toasts, { ...toast, id, expires }] }));
    },

    removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    clearToasts: () => set({ toasts: [] }),

    closeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.map((t) =>
                t.id === id ? { ...t, closing: true } : t
            )
        }));

        setTimeout(() => get().removeToast(id), 500);
    }
}));
