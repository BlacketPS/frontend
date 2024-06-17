import { Rarity } from "blacket-types";

export interface RarityStoreContext {
    rarities: Rarity[];
    setRarities: (rarities: Rarity[]) => void;
}
