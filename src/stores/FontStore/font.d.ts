import { Font } from "blacket-types";

export interface FontStoreContext {
    fonts: Font[],
    setFonts: (fonts: Font[]) => void
}
