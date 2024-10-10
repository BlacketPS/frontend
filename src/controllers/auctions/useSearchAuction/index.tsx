import { AuctionsSearchAuctionDto } from "@blacket/types";

export function useSearchAuction() {
    const searchAuction = (dto?: AuctionsSearchAuctionDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.get(`/api/auctions/${JSON.stringify(dto)}`)
        .then((res: Fetch2Response) => resolve(res))
        .catch(reject));

    return { searchAuction };
}
