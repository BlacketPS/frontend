import { create } from "zustand";

import { DataStore } from "./dataStore.d";

export const useData = create<DataStore>((set, get) => ({
    badges: [],
    setBadges: (badges) => set({ badges }),

    banners: [],
    setBanners: (banners) => set({ banners }),

    blooks: [],
    setBlooks: (blooks) => set({ blooks }),

    emojis: [],
    setEmojis: (emojis) => set({ emojis }),

    fonts: [],
    setFonts: (fonts) => set({ fonts }),

    items: [],
    setItems: (items) => set({ items }),

    itemShop: [],
    setItemShop: (itemShop) => set({ itemShop }),

    packs: [],
    setPacks: (packs) => set({ packs }),

    rarities: [],
    setRarities: (rarities) => set({ rarities }),

    titles: [],
    setTitles: (titles) => set({ titles }),

    products: [],
    setProducts: (products) => set({ products }),

    stores: [],
    setStores: (stores) => set({ stores }),

    spinnyWheels: [],
    setSpinnyWheels: (spinnyWheels) => set({ spinnyWheels }),

    titleIdToText: (id) => {
        const match = get().titles.find((t) => t.id === id);
        return match ? match.name : "Unknown";
    },

    fontIdToName: (id) => {
        const match = get().fonts.find((f) => f.id === id);
        return match ? match.name : "Nunito";
    }
}));