import { useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { SearchBox } from "@components/index";
import { Auction } from "./components/index";
import styles from "./auctionHouse.module.scss";

import { AuctionsAuctionEntity } from "blacket-types";

export default function AuctionHouse() {
    const [auctions, setAuctions] = useState<AuctionsAuctionEntity[]>([]);

    const { user } = useUser();

    if (!user) return null;

    useEffect(() => {
        window.fetch2.get("/api/auctions").then((res) => {
            setAuctions(res.data);

            console.log(res.data);
        });
    }, []);

    return (
        <>
            <SearchBox
                placeholder="Search for an auction..."
                buttons={[
                    { icon: "fas fa-sliders", tooltip: "Change Filters", onClick: () => { } },
                    {
                        icon: "fas fa-times", tooltip: "Reset Search", onClick: () => { }
                    }
                ]}
                onChange={() => { }}
            />

            <div className={styles.auctionHouseContainer}>
                <div className={styles.auctionHouse}>
                    <div className={styles.auctionHouseItems}>
                        {auctions.map((auction) => {
                            console.log(auction);

                            return (
                                <Auction key={auction.id} auction={auction} />
                            );
                        })}
                    </div>
                </div>
            </div>

        </>
    );
}
