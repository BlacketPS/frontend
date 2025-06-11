import { Fragment, useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { InventoryBlook, SearchBox } from "@components/index";
import { ChangeFilterModal, SetHolder, Item, RightBlook, RightItem, RightButton, SellBlooksModal, AuctionModal } from "./components";
import styles from "./inventory.module.scss";

import { AuctionTypeEnum, Blook as BlookType, Item as ItemType } from "@blacket/types";
import { SearchOptions } from "./inventory.d";

export default function Inventory() {
    const { createModal } = useModal();
    const { user } = useUser();
    const { packs, blooks, items } = useData();
    const { resourceIdToPath } = useResource();

    if (!user) return <Navigate to="/login" />;

    const getUserBlookQuantity = (blookId: number) => {
        return user.blooks.filter((blook) => blook.blookId === blookId && !blook.shiny).length;
    };

    const getUserShinyBlookQuantity = (blookId: number) => {
        return user.blooks.filter((blook) => blook.blookId === blookId && blook.shiny).length;
    };

    const hasUserBlook = (blookId: number) => {
        return user.blooks.some((blook) => blook.blookId === blookId && !blook.shiny);
    };

    const hasShinyUserBlook = (blookId: number) => {
        return user.blooks.some((blook) => blook.blookId === blookId && blook.shiny);
    };

    const randomBlookIdFromMyBlooks = user.blooks[Math.floor(Math.random() * user.blooks.length)]?.blookId;
    const [selectedBlook, setSelectedBlook] = useState<BlookType | null>(blooks.find((blook) => blook.id === randomBlookIdFromMyBlooks) || null);
    const [selectedBlookShiny, setSelectedBlookShiny] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
    const [search, setSearch] = useState<SearchOptions>({
        query: localStorage.getItem("INVENTORY_SEARCH_QUERY") || "",
        rarity: parseInt(localStorage.getItem("INVENTORY_SEARCH_RARITY")!),
        onlyDupes: localStorage.getItem("INVENTORY_SEARCH_ONLY_DUPES") === "true",
        onlyShiny: localStorage.getItem("INVENTORY_SEARCH_ONLY_SHINY") === "true",
        onlyOwned: localStorage.getItem("INVENTORY_SEARCH_ONLY_OWNED") === "true"
    });

    const nonPackBlooks = blooks.filter((blook) => !blook.packId).map((blook) => blook.id);

    const selectBlook = (blook: BlookType) => {
        if (!hasUserBlook(blook.id)) return;

        setSelectedItem(null);
        setSelectedBlook(blook);
        setSelectedBlookShiny(false);
    };

    const selectShinyBlook = (blook: BlookType) => {
        if (!hasShinyUserBlook(blook.id)) return;

        setSelectedItem(null);
        setSelectedBlook(blook);
        setSelectedBlookShiny(true);
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
                && (!search.onlyDupes || getUserBlookQuantity(blook.id) > 1)
                && (!search.onlyOwned || hasUserBlook(blook.id))
                && (!search.onlyShiny || hasShinyUserBlook(blook.id))
            );
    }, [blooks, search]);

    const filterMiscBlooks = useCallback(() => {
        return blooks
            .filter((blook) =>
                nonPackBlooks.includes(blook.id)
                && blook.name.toLowerCase().includes(search.query.toLowerCase())
                && hasUserBlook(blook.id)
                && (!search.rarity || blook.rarityId === search.rarity)
                && (!search.onlyDupes || getUserBlookQuantity(blook.id) > 1)
                && (!search.onlyShiny || hasShinyUserBlook(blook.id))
            );
    }, [blooks, search]);

    const setSearchOptionsFromLocalStorage = () => {
        const query = localStorage.getItem("INVENTORY_SEARCH_QUERY");
        const rarity = parseInt(localStorage.getItem("INVENTORY_SEARCH_RARITY")!);
        const dupesOnly = localStorage.getItem("INVENTORY_SEARCH_ONLY_DUPES");
        const onlyShiny = localStorage.getItem("INVENTORY_SEARCH_ONLY_SHINY");
        const onlyOwned = localStorage.getItem("INVENTORY_SEARCH_ONLY_OWNED");

        setSearch({
            query: query || "",
            rarity: rarity ?? null,
            onlyDupes: dupesOnly === "true",
            onlyShiny: onlyShiny === "true",
            onlyOwned: onlyOwned === "true"
        });
    };

    return (
        <>
            <div className={styles.leftSide}>
                <SearchBox
                    noPadding={true}
                    placeholder="Search for an item..."
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
                                localStorage.removeItem("INVENTORY_SEARCH_RARITY");
                                localStorage.removeItem("INVENTORY_SEARCH_ONLY_DUPES");
                                localStorage.removeItem("INVENTORY_SEARCH_ONLY_OWNED");
                                localStorage.removeItem("INVENTORY_SEARCH_ONLY_SHINY");

                                setSearch({
                                    query: "",
                                    onlyDupes: false,
                                    onlyShiny: false,
                                    onlyOwned: false
                                });
                            }
                        }
                    ]}
                />

                <div className={styles.inventoryHolder}>
                    {filterItems().length > 0 && <SetHolder name="My Items" nothing={false}>
                        {filterItems().map((item) => <Item key={item.id} item={items.find((i) => i.id === item.itemId)!} usesLeft={item.usesLeft} onClick={() => selectItem(items.find((i) => i.id === item.itemId)!)} />)}
                    </SetHolder>}

                    {packs.sort((a, b) => a.priority - b.priority).map((pack) => {
                        const filteredBlooks = filterPackBlooks(pack.id);

                        if (filteredBlooks.length > 0) return <SetHolder key={pack.id} name={`${pack.name} Pack`} icon={resourceIdToPath(pack.iconId)} nothing={false}>
                            {
                                filterPackBlooks(pack.id).sort((a, b) => a.priority - b.priority)
                                    .map((blook, i) => (
                                        <Fragment key={i}>
                                            {!search.onlyShiny && <InventoryBlook blook={blook} shiny={false} locked={!hasUserBlook(blook.id)} quantity={getUserBlookQuantity(blook.id)} onClick={() => selectBlook(blook)} />}

                                            {hasShinyUserBlook(blook.id) && <InventoryBlook blook={blook} shiny={true} locked={false} quantity={getUserShinyBlookQuantity(blook.id)} onClick={() => selectShinyBlook(blook)} />}
                                        </Fragment>)
                                    )
                            }
                        </SetHolder>;
                        else if (filterPackBlooks.length === 0 && search.query.length === 0) return <SetHolder key={pack.id} name={`${pack.name} Pack`} nothing={true} />;
                    })}

                    {user.blooks.filter((blook) => nonPackBlooks.includes(blook.blookId)).length !== 0 && <SetHolder nothing={false} name="Miscellaneous">
                        {
                            filterMiscBlooks().sort((a, b) => a.priority - b.priority)
                                .map((blook, i) => (
                                    <Fragment key={i}>
                                        {!search.onlyShiny && <InventoryBlook blook={blook} shiny={false} locked={!hasUserBlook(blook.id)} quantity={getUserBlookQuantity(blook.id)} onClick={() => selectBlook(blook)} />}

                                        {hasShinyUserBlook(blook.id) && <InventoryBlook blook={blook} shiny={true} locked={false} quantity={getUserShinyBlookQuantity(blook.id)} onClick={() => selectShinyBlook(blook)} />}
                                    </Fragment>)
                                )
                        }
                    </SetHolder>}
                </div>
            </div>

            {user.blooks.length > 0 && selectedBlook && <RightBlook blook={selectedBlook} shiny={selectedBlookShiny} owned={
                !selectedBlookShiny ? getUserBlookQuantity(selectedBlook.id) : getUserShinyBlookQuantity(selectedBlook.id)
            } noBlooksOwned={user.blooks.length < 1}>
                {user.blooks.length > 0 && selectedBlook && <div className={styles.rightButtonContainer}>
                    <RightButton image={window.constructCDNUrl("/content/token.png")} onClick={() => createModal(<SellBlooksModal blook={selectedBlook} shiny={selectedBlookShiny} />)}>Sell</RightButton>
                    <RightButton icon="fas fa-building-columns" onClick={() => createModal(<AuctionModal type={AuctionTypeEnum.BLOOK} blook={selectedBlook} shiny={selectedBlookShiny} />)}>Auction</RightButton>
                </div>}
            </RightBlook>}

            {user.items.length > 0 && selectedItem && <RightItem item={selectedItem}>
                <div className={styles.rightButtonContainer}>
                    {selectedItem.canUse && <RightButton image={window.constructCDNUrl("/content/use.png")}>Use</RightButton>}
                    {selectedItem.canAuction && <RightButton icon="fas fa-building-columns" onClick={() => createModal(<AuctionModal type={AuctionTypeEnum.ITEM} item={selectedItem} />)}>Auction</RightButton>}
                </div>
            </RightItem>}
        </>
    );
}
