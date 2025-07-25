import { AuctionsAuctionEntity, AuctionsSearchAuctionDto } from "@blacket/types";

export interface AuctionHouseStore {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    auctions: AuctionsAuctionEntity[];
    setAuctions: (auctions: AuctionsAuctionEntity[] | ((prev: AuctionsAuctionEntity[]) => AuctionsAuctionEntity[])) => void;
    search: AuctionsSearchAuctionDto;
    setSearch: (search: AuctionsSearchAuctionDto) => void;
    getAuctions: () => void;
}
