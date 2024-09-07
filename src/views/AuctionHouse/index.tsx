import { useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useAuctionHouse } from "@stores/AuctionHouseStore/index";
import { Loader, SearchBox } from "@components/index";
import { Auction, AuctionModal, BuyItNowModal, ChangeFilterModal, RemoveAuctionModal } from "./components/index";
import styles from "./auctionHouse.module.scss";

export default function AuctionHouse() {
    const { user } = useUser();
    const { createModal } = useModal();
    const { blooks, items } = useData();
    const { loading, auctions, search, setSearch } = useAuctionHouse();

    const [query, setQuery] = useState<string>(search.query || "");

    if (!user) return null;

    const setAuctionSearch = () => {
        const blook = blooks.find((blook) => blook.name.toLowerCase() === query.toLowerCase());
        const item = items.find((item) => item.name.toLowerCase() === query.toLowerCase());

        if (blook) setSearch({ ...search, query: undefined, blookId: blook.id, itemId: undefined });
        else if (item) setSearch({ ...search, query: undefined, itemId: item.id, blookId: undefined });
        else setSearch({
            ...search,
            seller: undefined,
            blookId: undefined,
            itemId: undefined,
            query
        });
    };

    return (
        <>
            <SearchBox
                placeholder="Search for an auction..."
                buttons={[
                    {
                        icon: "fas fa-times", tooltip: "Reset Search", onClick: () => {
                            setQuery("");

                            setSearch({});
                        }
                    },
                    { icon: "fas fa-sliders", tooltip: "Change Filters", onClick: () => createModal(<ChangeFilterModal />) },
                    { icon: "fas fa-magnifying-glass", tooltip: "Search", onClick: () => setAuctionSearch() }
                ]}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") setAuctionSearch();
                }}
                value={query}
            />

            <div className={styles.auctionHouseContainer}>
                <div className={styles.auctionHouse}>
                    <div className={styles.auctionHouseItems}>
                        {!loading ? auctions.map((auction) => {
                            return (
                                <Auction
                                    key={auction.id}
                                    auction={auction}
                                    onClick={() => {
                                        switch (true) {
                                            case auction.seller.id === user.id:
                                                createModal(<RemoveAuctionModal auction={auction} />);
                                                break;
                                            case auction.buyItNow:
                                                createModal(<BuyItNowModal auction={auction} />);
                                                break;
                                            default:
                                                createModal(<AuctionModal auctionId={auction.id} />);
                                                break;
                                        }
                                    }}
                                />
                            );
                        }) : <Loader noModal style={{ marginBottom: 50 }} />}
                    </div>
                </div>
            </div>

        </>
    );
}
