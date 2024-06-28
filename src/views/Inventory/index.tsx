import { useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { usePack } from "@stores/PackStore/index";
import { useBlook } from "@stores/BlookStore/index";
import { useItem } from "@stores/ItemStore/index";
import { SearchBox } from "@components/index";
import { ChangeFilterModal, SetHolder, Blook, Item, RightBlook, RightItem, RightButton, SellBlooksModal } from "./components";
import styles from "./inventory.module.scss";

import { Blook as BlookType, Item as ItemType } from "blacket-types";
import { SearchOptions } from "./inventory.d";

export default function Inventory() {
    const { createModal } = useModal();
    const { user } = useUser();
    const { packs } = usePack();
    const { blooks } = useBlook();
    const { items } = useItem();

    if (!user) return <Navigate to="/login" />;

    // i have to make a const for this i have no idea why but if i don't it just sometimes can't find a blook theres 0 reason for it but using a const works! i love typescript
    const randomBlookIdFromMyBlooks = Object.keys(user.blooks)[Math.floor(Math.random() * Object.keys(user.blooks).length)];
    const [selectedBlook, setSelectedBlook] = useState<BlookType | null>(blooks.find((blook) => blook.id === parseInt(randomBlookIdFromMyBlooks)) || null);
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
    const [search, setSearch] = useState<SearchOptions>({ query: localStorage.getItem("INVENTORY_SEARCH_QUERY") || "", rarity: parseInt(localStorage.getItem("INVENTORY_SEARCH_RARITY")!), dupesOnly: localStorage.getItem("INVENTORY_SEARCH_DUPES_ONLY") === "true", onlyOwned: localStorage.getItem("INVENTORY_SEARCH_ONLY_OWNED") === "true" });

    const nonPackBlooks = blooks.filter((blook) => !blook.packId).map((blook) => blook.id);

    const selectBlook = (blook: BlookType) => {
        if (!user.blooks[blook.id]) return;

        setSelectedItem(null);
        setSelectedBlook(blook);
    };

    const selectItem = (item: ItemType) => {
        if (!user.items.find((i) => i.itemId === item.id)) return;

        setSelectedBlook(null);
        setSelectedItem(item);
    };

    const filterItems = useCallback(() => {
        return user.items
            .filter((item) =>
                items.find((i) => i.id === item.itemId)!.name.toLowerCase().includes(search.query.toLowerCase())
                && (!search.rarity || items.find((i) => i.id === item.itemId)!.rarityId === search.rarity)
            );
    }, [user.items, items, search]);

    const filterPackBlooks = useCallback((packId: number) => {
        return blooks
            .filter((blook) =>
                blook.packId === packId
                && blook.name.toLowerCase().includes(search.query.toLowerCase())
                && (!search.rarity || blook.rarityId === search.rarity)
                && (!search.dupesOnly || user.blooks[blook.id] > 1)
                && (!search.onlyOwned || user.blooks[blook.id])
            );
    }, [blooks, user.blooks, search]);

    const filterMiscBlooks = useCallback(() => {
        return blooks
            .filter((blook) =>
                nonPackBlooks.includes(blook.id)
                && blook.name.toLowerCase().includes(search.query.toLowerCase())
                && user.blooks[blook.id]
                && (!search.rarity || blook.rarityId === search.rarity)
                && (!search.dupesOnly || user.blooks[blook.id] > 1)
            );
    }, [blooks, user.blooks, search]);

    const setSearchOptionsFromLocalStorage = () => {
        const query = localStorage.getItem("INVENTORY_SEARCH_QUERY");
        const rarity = parseInt(localStorage.getItem("INVENTORY_SEARCH_RARITY")!);
        const dupesOnly = localStorage.getItem("INVENTORY_SEARCH_DUPES_ONLY");
        const onlyOwned = localStorage.getItem("INVENTORY_SEARCH_ONLY_OWNED");

        setSearch({
            query: query || "",
            rarity: rarity ?? null,
            dupesOnly: dupesOnly === "true",
            onlyOwned: onlyOwned === "true"
        });
    };

    return (
        <>
            <div className={styles.leftSide}>
                <SearchBox
                    noPadding={true}
                    placeholder="Search for a blook or item..."
                    value={search.query}
                    onChange={(e) => {
                        localStorage.setItem("INVENTORY_SEARCH_QUERY", e.target.value);

                        setSearch({
                            ...search,
                            query: e.target.value
                        });
                    }}
                    buttons={[
                        { icon: "fas fa-sliders", tooltip: "Change Filters", onClick: () => createModal(<ChangeFilterModal onSave={setSearchOptionsFromLocalStorage} />) },
                        {
                            icon: "fas fa-times", tooltip: "Reset Search", onClick: () => {
                                localStorage.removeItem("INVENTORY_SEARCH_QUERY");

                                setSearch({ ...search, query: "" });
                            }
                        }
                    ]}
                />

                <div className={styles.inventoryHolder}>
                    {filterItems().length > 0 && <SetHolder name="My Items" nothing={false}>
                        {filterItems().map((item) => <Item key={item.id} item={items.find((i) => i.id === item.itemId)!} usesLeft={item.usesLeft} onClick={() => selectItem(items.find((i) => i.id === item.itemId)!)} />)}
                    </SetHolder>}

                    {packs.map((pack) => {
                        const filteredBlooks = filterPackBlooks(pack.id);

                        if (filteredBlooks.length > 0) return <SetHolder key={pack.id} name={`${pack.name} Pack`} nothing={false}>
                            {filterPackBlooks(pack.id).sort((a, b) => a.priority - b.priority).map((blook) => <Blook key={blook.id} blook={blook} locked={!user.blooks[blook.id]} quantity={user.blooks[blook.id]} onClick={() => selectBlook(blook)} />)}
                        </SetHolder>;
                        else if (filterPackBlooks.length === 0 && search.query.length === 0) return <SetHolder key={pack.id} name={`${pack.name} Pack`} nothing={true} />;
                    })}

                    {Object.keys(user.blooks).filter((blook) => nonPackBlooks.includes(parseInt(blook))).length !== 0 && <SetHolder nothing={false} name="Miscellaneous">
                        {filterMiscBlooks().map((blook) => <Blook key={blook.id} blook={blook} locked={!user.blooks[blook.id]} quantity={user.blooks[blook.id]} onClick={() => selectBlook(blook)} />)}
                    </SetHolder>}
                </div>
            </div>

            {Object.keys(user.blooks).length > 0 && selectedBlook && <RightBlook blook={selectedBlook} owned={user.blooks[selectedBlook.id]} noBlooksOwned={Object.keys(user.blooks).length < 1}>
                {Object.keys(user.blooks).length > 0 && selectedBlook && <div className={styles.rightButtonContainer}>
                    <RightButton image="https://cdn.blacket.org/static/content/token.png" onClick={() => createModal(<SellBlooksModal blook={selectedBlook} />)}>Sell</RightButton>
                    <RightButton icon="fas fa-building-columns">Auction</RightButton>
                </div>}
            </RightBlook>}

            {user.items.length > 0 && selectedItem && <RightItem item={selectedItem} usesLeft={user.items.find((i) => i.itemId === selectedItem.id)!.usesLeft}>
                <div className={styles.rightButtonContainer}>
                    {selectedItem.canUse && <RightButton image="https://cdn.blacket.org/static/content/use.png">Use</RightButton>}
                    {selectedItem.canAuction && <RightButton icon="fas fa-building-columns">Auction</RightButton>}
                </div>
            </RightItem>}
        </>
    );
}
