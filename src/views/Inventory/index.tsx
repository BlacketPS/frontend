import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Textfit from "react-textfit";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Blook, Button, ItemContainer, Markdown, PageHeader, RarityLabel, SearchBox } from "@components/index";
import { Info, SellBlooksModal, AuctionModal } from "./components/index";
import styles from "./inventory.module.scss";

import { SelectedTypeEnum } from "@components/ItemContainer/itemContainer.d";
import { AuctionTypeEnum, Blook as BlookType, Item as ItemType, Rarity, UserBlook, UserItem } from "@blacket/types";

export default function Inventory() {
    const { user, getBlookAmount } = useUser();
    if (!user) return <Navigate to="/login" />;

    const { blooks, items, rarities } = useData();
    const { resourceIdToPath } = useResource();
    const { createModal } = useModal();

    const [selectedType, setSelectedType] = useState<SelectedTypeEnum | null>(null);
    const [selected, setSelected] = useState<UserBlook | UserItem | null>(null);
    const [search, setSearch] = useState<string>("");

    const [blook, setBlook] = useState<BlookType | null>(null);
    const [item, setItem] = useState<ItemType | null>(null);
    const [rarity, setRarity] = useState<Rarity | null>(null);
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        switch (selectedType) {
            case SelectedTypeEnum.BLOOK:
                const blook = blooks.find((b) => b.id === (selected as UserBlook).blookId);

                setBlook(blook || null);
                setRarity(rarities.find((r) => r.id === blook?.rarityId) || null);
                setDescription(blook?.description || "No description available for this Blook.");
                break;
            case SelectedTypeEnum.ITEM:
                const item = items.find((i) => i.id === (selected as UserItem).itemId);

                setItem(item || null);
                setRarity(rarities.find((r) => r.id === item?.rarityId) || null);
                setDescription(item?.description || "No description available for this Item.");
                break;
            default:
                setBlook(null);
                setItem(null);
                setRarity(null);
                setDescription("");
        }
    }, [selected]);

    const getLowestSerialBlook = (blookId: number, shiny: boolean): number | null => {
        const blook = user.blooks
            .find((b) => b.blookId === blookId && b.shiny === shiny);
        if (!blook) return null;

        return blook.serial;
    };

    const getHighestSerialBlook = (blookId: number, shiny: boolean): number | null => {
        const blooks = user.blooks
            .filter((b) => b.blookId === blookId && b.shiny === shiny)
            .sort((a, b) => (b.serial ?? 0) - (a.serial ?? 0));
        if (blooks.length === 0) return null;

        if (blooks[0].serial === null) return null;
        else return blooks[0].serial;
    };

    return (
        <>
            {window.innerWidth > 768 && <PageHeader>Inventory</PageHeader>}

            <div className={styles.leftSide}>
                <SearchBox
                    noPadding={true}
                    placeholder="Search for an item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <ItemContainer
                    user={user}
                    options={{
                        showItems: true,
                        showBlooks: true,
                        showShiny: true,
                        showLocked: true,
                        showPacks: true,

                        searchQuery: search
                    }}
                    onClick={(item) => {
                        setSelectedType(item.type);
                        setSelected(item.item || null);
                    }}
                />
            </div>

            {selected && rarity && <div className={styles.rightSide}>
                <div className={styles.backgroundImageM}>
                    <img
                        src={
                            selectedType === SelectedTypeEnum.BLOOK
                                ? resourceIdToPath(blook!.backgroundId)
                                : window.constructCDNUrl("/content/blooks/backgrounds/Default.png")
                        }
                        draggable={false}
                    />
                </div>

                <div className={styles.top}>
                    <div className={styles.topBackgroundImage}>
                        <img
                            src={
                                selectedType === SelectedTypeEnum.BLOOK
                                    ? resourceIdToPath(blook!.backgroundId)
                                    : window.constructCDNUrl("/content/blooks/backgrounds/Default.png")
                            }
                            draggable={false}
                        />
                    </div>

                    <div className={styles.itemContainerM}>
                        <div className={styles.basicInfoM}>
                            <Textfit className={styles.itemNameM} mode="single" min={0} max={40}>
                                {selectedType === SelectedTypeEnum.BLOOK
                                    ? `${(selected as UserBlook).shiny ? "Shiny " : ""}${blook!.name}`
                                    : item?.name
                                }
                            </Textfit>

                            <Textfit className={styles.itemDescriptionM} mode="multi" min={0} max={20}>
                                {description}
                            </Textfit>
                        </div>

                        <div className={styles.itemImageContainerM}>
                            <Blook
                                // src={resourceIdToPath(selected.imageId)}
                                src={
                                    selectedType === SelectedTypeEnum.BLOOK
                                        ? resourceIdToPath(blook!.imageId)
                                        : resourceIdToPath(item!.imageId)
                                }
                                className={styles.itemImageM}
                                shiny={selectedType === SelectedTypeEnum.BLOOK && (selected as UserBlook).shiny}
                                big={blook!.isBig}
                            />
                        </div>
                    </div>

                    <div className={styles.itemContainer}>
                        <div className={styles.itemImageContainer}>
                            <Blook
                                src={
                                    selectedType === SelectedTypeEnum.BLOOK
                                        ? resourceIdToPath(blook!.imageId)
                                        : resourceIdToPath(item!.imageId)
                                }
                                className={styles.itemImage}
                                shiny={selectedType === SelectedTypeEnum.BLOOK && (selected as UserBlook).shiny}
                                big={blook!.isBig}
                            />
                        </div>

                        <div className={styles.basicInfo}>
                            <Textfit className={styles.itemName} mode="single" min={0} max={1000}>
                                {selectedType === SelectedTypeEnum.BLOOK
                                    ? blook!.name
                                    : item?.name
                                }
                            </Textfit>

                            <div className={styles.rarityLabelContainer}>
                                <div className={styles.rarityLabel}>
                                    <RarityLabel text={rarity.name} backgroundColor={rarity.color} />
                                </div>
                                {(selected as UserBlook).shiny && <>
                                    <div className={styles.rarityDivider} />

                                    <div className={styles.rarityLabel}>
                                        <RarityLabel text={"Shiny"} backgroundColor={"shiny"} />
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <Textfit className={styles.description} mode="multi" min={0} max={1000}>
                        <Markdown user={user}>
                            {description}
                        </Markdown>
                    </Textfit>

                    <div className={styles.infoContainer}>
                        <Info
                            name="Amount"
                            icon="fas fa-hashtag"
                        >
                            {selectedType === SelectedTypeEnum.BLOOK
                                ? getBlookAmount(blook!.id, (selected as UserBlook).shiny)
                                : (selected as UserItem).usesLeft}
                        </Info>
                        {selectedType === SelectedTypeEnum.BLOOK && <Info
                            name="Chance"
                            icon="fas fa-percentage"
                        >
                            {blook!.chance / ((selected as UserBlook).shiny ? 100 : 1)}%
                        </Info>}
                        {selectedType === SelectedTypeEnum.BLOOK && <Info
                            name="Sell Price"
                            icon="fas fa-dollar-sign"
                        >
                            {blook!.price * ((selected as UserBlook).shiny ? 10 : 1)}
                        </Info>}
                        {selectedType === SelectedTypeEnum.BLOOK && <Info
                            name="Lowest Serial"
                            icon="fas fa-arrow-down-1-9"
                        >
                            {
                                getLowestSerialBlook(blook!.id, (selected as UserBlook).shiny) !== null
                                    ? `#${getLowestSerialBlook(blook!.id, (selected as UserBlook).shiny)}`
                                    : "V2 Blook (N/A)"
                            }
                        </Info>}
                        <Info
                            name="Highest Serial"
                            icon="fas fa-arrow-up-1-9"
                        >
                            {
                                getHighestSerialBlook(blook!.id, (selected as UserBlook).shiny) !== null
                                    ? `#${getHighestSerialBlook(blook!.id, (selected as UserBlook).shiny)}`
                                    : "V2 Blook (N/A)"
                            }
                        </Info>
                        <Info
                            name="Recent Average Price"
                            icon="fas fa-dollar-sign"
                        >
                            TODO
                        </Info>
                        <Info
                            name="Exist Count"
                            icon="fas fa-database"
                        >
                            TODO
                        </Info>
                    </div>

                    <div className={styles.actionsContainer}>
                        <div className={styles.actions}>
                            <Button.GenericButton onClick={() => {
                                if (selectedType === SelectedTypeEnum.BLOOK) {
                                    createModal(<SellBlooksModal blook={blook!} shiny={(selected as UserBlook).shiny} />);
                                }
                            }}
                                icon="fas fa-gem"
                            >
                                Sell
                            </Button.GenericButton>

                            <Button.GenericButton onClick={() => {
                                if (selectedType === SelectedTypeEnum.BLOOK) {
                                    createModal(<AuctionModal type={AuctionTypeEnum.BLOOK} blook={blook!} shiny={(selected as UserBlook).shiny} />);
                                }
                            }}
                                icon="fas fa-building-columns"
                            >
                                Auction
                            </Button.GenericButton>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}
