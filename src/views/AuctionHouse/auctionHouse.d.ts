import { HTMLAttributes } from "react";
import { AuctionsAuctionEntity } from "blacket-types";

export interface AuctionProps extends HTMLAttributes<HTMLDivElement> {
    auction: AuctionsAuctionEntity;
}

export interface AuctionModalProps {
    auctionId: number;
}

export interface ModalProps {
    auction: AuctionsAuctionEntity;
}
