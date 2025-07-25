import { create } from "zustand";

import { InsanePullStore } from "./insanePullStore.d";

export const useInsanePull = create<InsanePullStore>((set) => ({
    video: null,
    setVideo: (video) => set({ video })
}));
