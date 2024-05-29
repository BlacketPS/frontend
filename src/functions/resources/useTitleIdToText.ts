import { useTitle } from "@stores/TitleStore/index";

import { Title } from "blacket-types";

export default function useTitleIdToText(titleId: number): string {
    const { titles } = useTitle();

    const titleText = titles.find((title: Title) => title.id === titleId)?.name;

    if (titleText) return titleText;
    else {
        console.warn(`[Blacket] Title with ID ${titleId} not found in titles array.`);

        return "Unknown";
    }
}
