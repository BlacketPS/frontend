import { AuctionsAuctionEntity } from "@blacket/types";
import { HTMLAttributes } from "react";

export interface AuctionProps extends HTMLAttributes<HTMLDivElement> {
    auction: AuctionsAuctionEntity;
    useVhStyles: boolean;
}
