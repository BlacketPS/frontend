import { useUser } from "@stores/UserStore/index";

import { NotFound, AuctionsCreateAuctionDto } from "@blacket/types";

export function useCreateAuction() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const createAuction = (dto: AuctionsCreateAuctionDto, tax: number) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.post("/api/auctions", dto)
        .then((res: Fetch2Response) => {
            const userBlooks = user.blooks;
            const userItems = user.items;

            if (dto.blookId) {
                (userBlooks[dto.blookId] as number) -= 1;
                if ((userBlooks[dto.blookId] as number) < 1) delete userBlooks[dto.blookId];
            }

            if (dto.itemId) {
                const index = userItems.findIndex((item) => item.id === dto.itemId);

                if (index !== -1) userItems.splice(index, 1);
            }

            setUser({ ...user, blooks: userBlooks, items: userItems, tokens: user.tokens - tax });

            resolve(res);
        })
        .catch(reject));

    return { createAuction };
}
