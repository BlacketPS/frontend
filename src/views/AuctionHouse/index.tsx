import { useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useSearchAuction } from "@controllers/auctions/useSearchAuction/index";
import { SearchBox } from "@components/index";
import { Auction, BuyItNowModal } from "./components/index";
import styles from "./auctionHouse.module.scss";

import { AuctionsAuctionEntity, AuctionTypeEnum } from "blacket-types";

export default function AuctionHouse() {
    const [auctions, setAuctions] = useState<AuctionsAuctionEntity[]>([]);
    const [query, setQuery] = useState<string>("");

    const { user } = useUser();
    const { createModal } = useModal();

    const { searchAuction } = useSearchAuction();

    if (!user) return null;

    useEffect(() => {
        searchAuction({
            query: query !== "" ? query : undefined,
            endingSoon: true
        }).then((res) => {
            setAuctions(res.data);
        });
    }, [query]);

    return (
        <>
            <SearchBox
                placeholder="Search for an auction..."
                buttons={[
                    {
                        icon: "fas fa-times", tooltip: "Reset Search", onClick: () => { }
                    },
                    { icon: "fas fa-sliders", tooltip: "Change Filters", onClick: () => { } },
                    { icon: "fas fa-magnifying-glass", tooltip: "Search", onClick: () => { } }
                ]}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />

            <div className={styles.auctionHouseContainer}>
                <div className={styles.auctionHouse}>
                    <div className={styles.auctionHouseItems}>
                        {auctions.map((auction) => {
                            console.log(auction);

                            return (
                                <Auction
                                    key={auction.id}
                                    auction={auction}
                                    onClick={() => {
                                        if (auction.buyItNow) createModal(<BuyItNowModal
                                            auction={auction}
                                        />);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

        </>
    );
}
