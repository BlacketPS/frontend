import { useEffect, useState } from "react";
import { Blook, ImageOrVideo, Username } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { formatTimeRemaining } from "@functions/blacket/formatTimeRemaining";
import normalStyles from "./auction.module.scss";
import vhStyles from "./auctionVh.module.scss";

import { AuctionProps } from "./auction.d";
import { AuctionTypeEnum } from "@blacket/types";

export default function Auction({ auction, useVhStyles = false, ...props }: AuctionProps) {
    const { resourceIdToPath } = useResource();
    const { blooks, items } = useData();

    const item = blooks.find((blook) => blook.id === auction?.blook?.blookId) || items.find((item) => item.id === auction?.item?.itemId);

    if (!item) return null;
    if (!auction.seller) return null;

    const [timeRemainingString, setTimeRemainingString] = useState<string>(formatTimeRemaining(new Date(auction.expiresAt)));

    useEffect(() => {
        let active = true;

        const tick = () => {
            if (!active) return;

            setTimeRemainingString(formatTimeRemaining(new Date(auction.expiresAt)));

            setTimeout(tick, 1000);
        };

        tick();

        return () => {
            active = false;
        };
    }, []);


    const styles = useVhStyles ? vhStyles : normalStyles;

    return (
        <div className={styles.auction} {...props}>
            <div className={styles.auctionImageContainer}>
                {(auction.type === AuctionTypeEnum.BLOOK && auction.blook) ? <Blook src={resourceIdToPath(item.imageId)} shiny={auction.blook.shiny} /> : <ImageOrVideo src={resourceIdToPath(item.imageId)} alt={item.name} />}
                {auction.type === AuctionTypeEnum.ITEM && <div className={styles.auctionUsesLeft}>{auction.item?.usesLeft?.toLocaleString()} Use{auction.item?.usesLeft !== 1 ? "s" : ""} Left</div>}
            </div>

            <div className={styles.auctionInfo}>
                <div>Name: <span>{auction.blook && auction.blook.shiny && "Shiny "}{item.name}</span></div>
                {auction.type === AuctionTypeEnum.BLOOK && auction.blook && `Serial: ${auction.blook.serial ? `#${auction.blook.serial}` : "V2 Blook N/A"}`}
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
