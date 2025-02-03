import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { NotFound, MarketOpenPackDto, UserBlook } from "@blacket/types";

type Response = Fetch2Response & { data: UserBlook };

export function useOpenPack() {
    const { user, setUser } = useUser();
    const { packs } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const openPack = (dto: MarketOpenPackDto) => new Promise<Response>((resolve, reject) => window.fetch2.post("/api/market/open-pack", dto)
        .then((res: Response) => {
            const userBlooks = user.blooks;
            const statistics = user.statistics;

            userBlooks.push(res.data);
            statistics.packsOpened++;

            setUser({ ...user, blooks: userBlooks, tokens: user.tokens - packs.find((pack) => pack.id === dto.packId)!.price, statistics });

            resolve(res);
        })
        .catch(reject));

    return { openPack };
}
