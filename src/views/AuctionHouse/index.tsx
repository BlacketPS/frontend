import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useAuctionHouse } from "@stores/AuctionHouseStore/index";
import { Auction, Loader, SearchBox } from "@components/index";
import { AuctionModal, BuyItNowModal, ChangeFilterModal, RemoveAuctionModal } from "./components/index";
import styles from "./auctionHouse.module.scss";

export default function AuctionHouse() {
    const { user } = useUser();
    const { createModal } = useModal();
    const { blooks, items } = useData();
    const { loading, auctions, search, setSearch } = useAuctionHouse();

    const [query, setQuery] = useState<string>(search.query || "");

    const [searchParams, setSearchParams] = useSearchParams();

    if (!user) return null;

    const setAuctionSearch = () => {
        const blook = blooks.find((blook) => blook.name.toLowerCase() === query.toLowerCase());
        const item = items.find((item) => item.name.toLowerCase() === query.toLowerCase());

        if (blook) setSearch({ ...search, query: undefined, blookId: blook.id, itemId: undefined });
        else if (item) setSearch({ ...search, query: undefined, itemId: item.id, blookId: undefined });
        else setSearch({
            ...search,
            id: undefined,
            seller: undefined,
            blookId: undefined,
            itemId: undefined,
            query
        });
    };

    useEffect(() => {
        const id = searchParams.get("id");

        if (!id) return;

        setSearchParams({});
        setSearch({ ...search, id: parseInt(id) });
    }, [searchParams]);

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
                    <div className={styles.auctionHouseItemsContainer}>
                        {!loading ? auctions.length > 0 ? <div className={styles.auctionHouseItems}>
                            {auctions.map((auction) => {
                                return (
                                    <Auction
                                        key={auction.id}
                                        auction={auction}
                                        useVhStyles={false}
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
                            })}
                        </div> : <div className={styles.noAuctions}>
                            <img className={styles.noAuctionsImage} src={window.constructCDNUrl("/content/404.png")} />
                            No auctions found.
                        </div> : <div className={styles.auctionLoaderContainer}><Loader noModal style={{ marginBottom: 50 }} /></div>}
                    </div>
                </div>
            </div>

        </>
    );
}
