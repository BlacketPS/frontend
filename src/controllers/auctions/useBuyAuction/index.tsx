import { useUser } from "@stores/UserStore/index";

import { AuctionsAuctionEntity, AuctionsBuyAuctionDto, NotFound } from "@blacket/types";

export function useBuyAuction() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const buyAuction = (auction: AuctionsAuctionEntity, dto: AuctionsBuyAuctionDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put(`/api/auctions/${auction.id}/bin`, dto)
        .then((res: Fetch2Response) => {
            const userBlooks = user.blooks;
            const userItems = user.items;

            if (auction.blook) userBlooks.push(auction.blook);
            else if (auction.item) userItems.push(auction.item);

            setUser({ ...user, blooks: userBlooks, items: userItems, tokens: user.tokens - auction.price });

            resolve(res);
        })
        .catch(reject));

    return { buyAuction };
}
