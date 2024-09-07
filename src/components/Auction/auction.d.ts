import { HTMLAttributes } from "react";

export interface AuctionProps extends HTMLAttributes<HTMLDivElement> {
    auction: AuctionsAuctionEntity;
    useVhStyles: boolean;
}
