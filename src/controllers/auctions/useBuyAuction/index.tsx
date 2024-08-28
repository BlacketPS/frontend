import { useUser } from "@stores/UserStore/index";

import { AuctionsAuctionEntity, NotFound } from "blacket-types";

export function useBuyAuction() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const buyAuction = (auction: AuctionsAuctionEntity) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put(`/api/auctions/${auction.id}/bin`, {})
        .then((res: Fetch2Response) => {
            const userBlooks = user.blooks;
            const userItems = user.items;

            if (auction.blookId) (userBlooks[auction.blookId] as number) += 1;
            else if (auction.item) userItems.push(auction.item);

            setUser({ ...user, blooks: userBlooks, items: userItems, tokens: user.tokens - auction.price });

            resolve(res);
        })
        .catch(reject));

    return { buyAuction };
}
