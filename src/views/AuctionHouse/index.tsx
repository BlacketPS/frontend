import { ImageOrVideo, SearchBox } from "@components/index";
import styles from "./auctionHouse.module.scss";
import { useEffect, useState } from "react";

export default function AuctionHouse() {
    return (
        <>
            <SearchBox
                placeholder="Search for an auction..."
                buttons={[
                    { icon: "fas fa-sliders", tooltip: "Change Filters", onClick: () => {} },
                    {
                        icon: "fas fa-times", tooltip: "Reset Search", onClick: () => {}
                    }
                ]}
                onChange={() => { }}
            />

            <div className={styles.auctionHouseContainer}>
                <div className={styles.auctionHouse}>
                    <div className={styles.auction}>
                        <ImageOrVideo src="https://cdn.blacket.org/static/content/blooks/Bia.webm" alt="Blook" />
                        <div className={styles.auctionInfo}>
                            <div className={styles.auctionName}>Item Name</div>
                            <div className={styles.auctionPrice}>
                                <img src="https://cdn.blacket.org/static/content/token.png" alt="Tokens" />
                                1000
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
