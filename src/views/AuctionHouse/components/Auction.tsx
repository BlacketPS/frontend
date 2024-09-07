import { ImageOrVideo, Username } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import styles from "../auctionHouse.module.scss";

import { AuctionProps } from "../auctionHouse.d";
import { AuctionTypeEnum } from "blacket-types";
import { useEffect } from "react";

const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};

export default function Auction({ auction, ...props }: AuctionProps) {
    const { resourceIdToPath } = useResource();
    const { blooks, items } = useData();

    const item = blooks.find((blook) => blook.id === auction.blookId) || items.find((item) => item.id === auction?.item?.itemId);

    if (!item) return null;
    if (!auction.seller) return null;

    return (
        <div className={styles.auction} {...props}>
            <div className={styles.auctionImageContainer}>
                <ImageOrVideo src={resourceIdToPath(item.imageId)} alt={item.name} />
                {auction.type === AuctionTypeEnum.ITEM && <div className={styles.auctionUsesLeft}>{auction.item?.usesLeft?.toLocaleString()} Use{auction.item?.usesLeft !== 1 ? "s" : ""} Left</div>}
            </div>

            <div className={styles.auctionInfo}>
                <div>Name: <span>{item.name}</span></div>
                <div>Type: <span>{auction.type === AuctionTypeEnum.BLOOK ? "Blook" : "Item"}</span></div>
                <div className={styles.auctionPrice}>
                    {
                        auction.buyItNow
                            ? "Price"
                            : auction.bids!.length > 0
                                ? "Current Bid"
                                : "Starting Bid"
                    }: <img src={window.constructCDNUrl("/content/token.png")} alt="Token" draggable={false} /> <span>{
                        auction.buyItNow
                            ? auction.price.toLocaleString()
                            : auction.bids!.length > 0
                                ? auction.bids![0].amount.toLocaleString()
                                : auction.price.toLocaleString()
                    }</span>
                </div>
                <div>Seller: <Username user={auction.seller} /></div>
                {!auction.buyItNow && <div>Bids: <span>{auction.bids.length}</span></div>}
            </div>

            <div className={styles.auctionBadge}>{auction.buyItNow ? "BIN" : "AUCTION"}</div>
            <div className={styles.auctionTime}>
                {formatTimeRemaining(new Date(auction.expiresAt))} <i className="fas fa-clock" />
            </div>
        </div>
    );
}
