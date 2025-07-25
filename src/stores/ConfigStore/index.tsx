import { create } from "zustand";

import { ConfigStore } from "./configStore.d";

export const useConfig = create<ConfigStore>((set) => ({
    config: null,
    loading: true,
    error: false,

    setConfig: (config) => set({ config }),

    fetchConfig: async () => {
        try {
            const res = await window.fetch2.get("/api");

            set({ config: res.data, loading: false });
        } catch (res: any) {
            if (res.status !== 403 && res.status !== 429) set({ error: true, loading: false });
            else if (res.status === 429) set({ error: "too many requests", loading: false });
            else set({ error: res.data.message, loading: false });
        }
    }
}));