import { AuctionsAuctionEntity, AuctionsBidAuctionDto } from "blacket-types";

export function useBidAuction() {
    const bidAuction = (auction: AuctionsAuctionEntity, dto: AuctionsBidAuctionDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.post(`/api/auctions/${auction.id}/bid`, dto)
        .then((res: Fetch2Response) => resolve(res))
        .catch(reject));

    return { bidAuction };
}
