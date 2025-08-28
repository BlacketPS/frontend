import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { NotFound, BlooksSellBlookDto } from "@blacket/types";

export function useSellBlooks() {
    const { user, setUser } = useUser();
    const { blooks } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const sellBlooks = (dto: BlooksSellBlookDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put("/api/blooks/sell-blooks", dto)
        .then((res: Fetch2Response) => {
            let diamondsEarned = 0;

            for (const blookId of dto.blooks) {
                const userBlook = user.blooks.find((b) => b.id === blookId);
                if (!userBlook) continue;

                const blook = blooks.find((b) => b.id === userBlook.blookId);
                if (!blook) continue;

                diamondsEarned += blook.price;
            }

            const newBlooks = user.blooks.filter((blook) => !dto.blooks.includes(blook.id));
            const newDiamonds = user.diamonds + diamondsEarned;

            setUser({
                ...user,
                blooks: newBlooks,
                diamonds: newDiamonds
            });

            resolve(res);
        })
        .catch(reject));

    return { sellBlooks };
}
