import { DiscordLinkDto } from "@blacket/types";
import { DiscordLinkResponse } from "./useDiscordLink.d";

export function useDiscordLink() {
    const linkDiscord = (dto: DiscordLinkDto) => new Promise<DiscordLinkResponse>((resolve, reject) => window.fetch2.post("/api/discord/link", dto)
        .then((res: DiscordLinkResponse) => {
            resolve(res);
        })
        .catch(reject));

    return { linkDiscord };
}
