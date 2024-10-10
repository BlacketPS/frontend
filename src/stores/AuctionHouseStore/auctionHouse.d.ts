import { AuctionsAuctionEntity, AuctionsSearchAuctionDto } from "@blacket/types";

export interface AuctionHouseStoreContext {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    auctions: AuctionsAuctionEntity[];
    setAuctions: (auctions: AuctionsAuctionEntity[]) => void;
    search: AuctionsSearchAuctionDto;
    setSearch: (search: AuctionsSearchAuctionDto) => void;
    getAuctions: () => void;
}
