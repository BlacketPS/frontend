import { Banner, Blook, Emoji, Font, Item, Pack, Rarity, Title } from "blacket-types";

export interface DataStoreContext {
    badges: any[];
    setBadges: (badges: any[]) => void;
    banners: Banner[];
    setBanners: (banners: Banner[]) => void;
    blooks: Blook[];
    setBlooks: (blooks: Blook[]) => void;
    emojis: Emoji[];
    setEmojis: (emojis: Emoji[]) => void;
    fonts: Font[];
    setFonts: (fonts: Font[]) => void;
    items: Item[];
    setItems: (items: Item[]) => void;
    packs: Pack[];
    setPacks: (packs: Pack[]) => void;
    rarities: Rarity[];
    setRarities: (rarities: Rarity[]) => void;
    titles: Title[];
    setTitles: (titles: Title[]) => void;
    
    titleIdToText: (id: number) => string;
    fontIdToName: (id: number) => string;
}