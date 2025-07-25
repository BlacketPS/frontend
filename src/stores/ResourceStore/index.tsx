import { create } from "zustand";

import { ResourceStore } from "./resourceStore.d";

export const useResource = create<ResourceStore>((set, get) => ({
    resources: [],

    setResources: (resources) => set({ resources }),

    resourceIdToPath: (id) => {
        const resource = get().resources.find((r) => r.id === id);

        return resource ? resource.path.replace("{cdn}", window.constructCDNUrl("")) : window.errorImage;
    }
}));