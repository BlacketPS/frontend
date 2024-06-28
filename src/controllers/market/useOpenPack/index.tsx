import { useUser } from "@stores/UserStore/index";
import { usePack } from "@stores/PackStore/index";

import { OpenPackDto } from "blacket-types";
import { OpenPackResponse } from "./useOpenPack.d";

export function useOpenPack() {
    const { user, setUser } = useUser();
    const { packs } = usePack();

    const openPack = (dto: OpenPackDto) => new Promise<OpenPackResponse>((resolve, reject) => window.fetch2.post("/api/market/open-pack", dto)
        .then((res: OpenPackResponse) => {
            const userBlooks = user.blooks;

            if (!userBlooks[res.data.id]) userBlooks[res.data.id] = 1;
            else userBlooks[res.data.id]++;

            setUser({ ...user, blooks: userBlooks, tokens: user.tokens - packs.find((pack) => pack.id === dto.packId)!.price });

            resolve(res);
        })
        .catch(reject));

    return { openPack };
}
