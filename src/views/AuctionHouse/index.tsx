import { useUser } from "@stores/UserStore/index";
import { SearchBox } from "@components/index";
import { Auction } from "./components";
import styles from "./auctionHouse.module.scss";

export default function AuctionHouse() {
    const { user } = useUser();

    if (!user) return null;

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
                    </div>
                </div>
            </div>

        </>
    );
}
