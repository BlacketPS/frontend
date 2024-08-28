import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { NotFound, BlooksSellBlookDto } from "blacket-types";

export function useSellBlooks() {
    const { user, setUser } = useUser();
    const { blooks } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const sellBlooks = (dto: BlooksSellBlookDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put("/api/blooks/sell-blooks", dto)
        .then((res: Fetch2Response) => {
            const userBlooks = user.blooks;

            (userBlooks[dto.blookId] as number) -= dto.quantity;
            if ((userBlooks[dto.blookId] as number) < 1) delete userBlooks[dto.blookId];

            const blook = blooks.find((b) => b.id === dto.blookId);
            if (!blook) return reject("Blook not found");

            setUser({ ...user, blooks: userBlooks, tokens: user.tokens + blook.price * dto.quantity });

            resolve(res);
        })
        .catch(reject));

    return { sellBlooks };
}
