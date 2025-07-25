import { create } from "zustand";

import { LoadingStore } from "./loadingStore.d";

export const useLoading = create<LoadingStore>((set) => ({
    loading: false,
    setLoading: (loading) => set({ loading })
}));
