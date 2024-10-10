import { useEffect, useState } from "react";
import { ImageOrVideo, Username } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import normalStyles from "./auction.module.scss";
import vhStyles from "./auctionVh.module.scss";

import { AuctionProps } from "./auction.d";
import { AuctionTypeEnum } from "@blacket/types";

const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 1) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours >= 1) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes >= 1) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};

export default function Auction({ auction, useVhStyles = false, ...props }: AuctionProps) {
    const { resourceIdToPath } = useResource();
    const { blooks, items } = useData();

    const item = blooks.find((blook) => blook.id === auction.blookId) || items.find((item) => item.id === auction?.item?.itemId);

    if (!item) return null;
    if (!auction.seller) return null;

    const [timeRemainingString, setTimeRemainingString] = useState<string>(formatTimeRemaining(new Date(auction.expiresAt)));

    useEffect(() => {
        const interval = setInterval(() => setTimeRemainingString(formatTimeRemaining(new Date(auction.expiresAt))), 1000);

        return () => clearInterval(interval);
    }, []);

    const styles = useVhStyles ? vhStyles : normalStyles;

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
                {timeRemainingString} <i className="fas fa-clock" />
            </div>
        </div>
    );
}
