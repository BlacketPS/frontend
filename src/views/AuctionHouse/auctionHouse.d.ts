import { HTMLAttributes } from "react";
import { AuctionsAuctionEntity, AuctionTypeEnum, Blook, Item } from "blacket-types";

export interface AuctionProps extends HTMLAttributes<HTMLDivElement> {
    auction: AuctionsAuctionEntity;
}

export interface BuyItNowModalProps {
    auction: AuctionsAuctionEntity;
}
