import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { NotFound, BlooksSellBlookDto } from "@blacket/types";

export function useSellBlooks() {
    const { user, setUser } = useUser();
    const { blooks } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const sellBlooks = (dto: BlooksSellBlookDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put("/api/blooks/sell-blooks", dto)
        .then((res: Fetch2Response) => {
            let tokensEarned = 0;

            for (const blookId of dto.blooks) {
                const userBlook = user.blooks.find((b) => b.id === blookId);
                if (!userBlook) continue;

                const blook = blooks.find((b) => b.id === userBlook.blookId);
                if (!blook) continue;

                tokensEarned += blook.price;
            }

            const newBlooks = user.blooks.filter((blook) => !dto.blooks.includes(blook.id));
            const newTokens = user.tokens + tokensEarned;

            setUser({
                ...user,
                blooks: newBlooks,
                tokens: newTokens
            });

            resolve(res);
        })
        .catch(reject));

    return { sellBlooks };
}
