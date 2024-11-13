import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { NotFound, MarketOpenPackDto } from "@blacket/types";
import { OpenPackResponse } from "./useOpenPack.d";

export function useOpenPack() {
    const { user, setUser } = useUser();
    const { packs } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const openPack = (dto: MarketOpenPackDto) => new Promise<OpenPackResponse>((resolve, reject) => window.fetch2.post("/api/market/open-pack", dto)
        .then((res: OpenPackResponse) => {
            const userBlooks = user.blooks;
            const statistics = user.statistics;

            if (!userBlooks[res.data.id]) userBlooks[res.data.id] = 1;
            else (userBlooks[res.data.id] as number)++;

            statistics.packsOpened++;

            setUser({ ...user, blooks: userBlooks, tokens: user.tokens - packs.find((pack) => pack.id === dto.packId)!.price, statistics });

            resolve(res);
        })
        .catch(reject));

    return { openPack };
}
