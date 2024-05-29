import { useFont } from "@stores/FontStore/index";

import { Font } from "blacket-types";

export default function useFontIdToName(fontId: number): string {
    const { fonts } = useFont();

    const fontName = fonts.find((font: Font) => font.id === fontId)?.name;

    if (fontName) return fontName;
    else {
        console.warn(`[Blacket] Font with ID ${fontId} not found in fonts array.`);

        return "Nunito";
    }
}
