import { AuctionsRecentAveragePriceEntity, AuctionsRecentAveragePriceDto } from "@blacket/types";

export function useRecentAveragePrice() {
    const getRecentAveragePrice = (dto?: AuctionsRecentAveragePriceDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.get(`/api/auctions/recent-average-price/${JSON.stringify(dto)}`)
        .then((res: Fetch2Response & { data: AuctionsRecentAveragePriceEntity }) => resolve(res))
        .catch(reject));

    return { getRecentAveragePrice };
}
