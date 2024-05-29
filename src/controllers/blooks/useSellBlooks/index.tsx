import { useUser } from "@stores/UserStore/index";
import { useBlook } from "@stores/BlookStore/index";

import { Blook, SellBlookDto } from "blacket-types";

export function useSellBlooks() {
    const { user, setUser } = useUser();
    const { blooks } = useBlook();

    const sellBlooks = (dto: SellBlookDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put("/api/blooks/sell-blooks", dto)
        .then((res: Fetch2Response) => {
            const userBlooks = user.blooks;

            userBlooks[dto.blookId] -= dto.quantity;
            if (userBlooks[dto.blookId] < 1) delete userBlooks[dto.blookId];

            const blook = blooks.find((b: Blook) => b.id === dto.blookId) as Blook;

            setUser({ ...user, blooks: userBlooks, tokens: user.tokens + blook.price * dto.quantity });

            resolve(res);
        })
        .catch(reject));

    return { sellBlooks };
}
