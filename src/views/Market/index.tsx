import { useState, useEffect, useRef, RefObject } from "react";
import { Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore";
import { useUser } from "@stores/UserStore/index";
import { useResource } from "@stores/ResourceStore";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useSettings } from "@controllers/settings/useSettings";
import { useOpenPack } from "@controllers/market/useOpenPack";
import { useBoosters } from "@controllers/data/useBoosters";
import { SidebarBody, PageHeader, Modal, Button, SearchBox } from "@components/index";
import { OpenPackModal, Category, Pack, OpenPackContainer, OpenPackBlook, Item, BoosterContainer, ParticleCanvas } from "./components";
import styles from "./market.module.scss";

import { DataBoostersEntity, MarketOpenPackDto, Pack as PackType, RarityAnimationTypeEnum, UserBlook } from "@blacket/types";
import { BigButtonClickType, ParticleCanvasRef, SearchOptions } from "./market.d";

export default function Market() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { resourceIdToPath } = useResource();
    const { packs, rarities, blooks, itemShop } = useData();

    if (!user) return <Navigate to="/login" />;

    const { changeSetting } = useSettings();
    const { openPack } = useOpenPack();
    const { getBoosters } = useBoosters();

    const [currentPack, setCurrentPack] = useState<any | null>(null);
    const [openingPack, setOpeningPack] = useState<boolean>(false);

    const [unlockedBlook, setUnlockedBlook] = useState<UserBlook | null>(null);

    const [bigButtonEvent, setBigButtonEvent] = useState<BigButtonClickType>(BigButtonClickType.CLOSE);

    const [search, setSearch] = useState<SearchOptions>({ query: localStorage.getItem("MARKET_SEARCH_QUERY") ?? "", onlyPurchasable: localStorage.getItem("MARKET_SEARCH_ONLY_PURCHASABLE") ? true : false });

    const [boosters, setBoosters] = useState<DataBoostersEntity | null>(null);

    const particleCanvasRef = useRef<ParticleCanvasRef>(null);

    const toggleInstantOpen = () => {
        setLoading("Changing settings");
        changeSetting({ key: "openPacksInstantly", value: !user.settings.openPacksInstantly })
            .then(() => setLoading(false))
            .catch(() => createModal(<Modal.ErrorModal>Failed to change settings.</Modal.ErrorModal>))
            .finally(() => setLoading(false));
    };

    const isNew = (blookId: number) => user.blooks?.find((b) => b.blookId === blookId) ? false : true;

    const purchasePack = (dto: MarketOpenPackDto) => new Promise<void>((resolve, reject) => {
        if (user.settings.openPacksInstantly && user.tokens < packs.find((pack) => pack.id === dto.packId)!.price) {
            return reject(createModal(<Modal.ErrorModal>You do not have enough tokens to purchase this pack.</Modal.ErrorModal>));
        }

        if (user.settings.openPacksInstantly) setLoading(`Opening ${packs.find((pack) => pack.id === dto.packId)!.name} pack`);

        openPack(dto)
            .then(async (res) => {
                setCurrentPack(packs.find((pack: PackType) => pack.id === dto.packId));

                setBigButtonEvent(BigButtonClickType.NONE);
                setTimeout(() => setBigButtonEvent(BigButtonClickType.OPEN), 100);

                resolve(setUnlockedBlook(res.data));
            })
            .catch((err) => {
                if (user.settings.openPacksInstantly) createModal(<Modal.ErrorModal>{err?.data?.message || "Something went wrong."}</Modal.ErrorModal>);
                reject(err);
            })
            .finally(() => {
                if (user.settings.openPacksInstantly) setLoading(false);
            });
    });

    const handleBigClick = async () => {
        if (!unlockedBlook) return;

        const blook = blooks.find((blook) => blook.id === unlockedBlook.blookId)!;
        const rarity = rarities.find((rarity) => rarity.id === blook.rarityId)!;

        switch (bigButtonEvent) {
            case BigButtonClickType.OPEN:
                setOpeningPack(true);

                setBigButtonEvent(BigButtonClickType.NONE);

                particleCanvasRef.current?.start();

                await new Promise((r) => {
                    let waitTime = 650;

                    if (rarity.animationType === RarityAnimationTypeEnum.EPIC) waitTime += 650;
                    if (rarity.animationType === RarityAnimationTypeEnum.LEGENDARY) waitTime += 1250;
                    if (rarity.animationType === RarityAnimationTypeEnum.CHROMA) waitTime += 1250;
                    if (unlockedBlook.shiny) waitTime += 2500;

                    setTimeout(() => {
                        r(true);
                    }, waitTime);
                });

                setBigButtonEvent(BigButtonClickType.CLOSE);

                break;
            case BigButtonClickType.CLOSE:
                particleCanvasRef.current?.stop();

                setCurrentPack(null);
                setUnlockedBlook(null);
                setOpeningPack(false);

                break;
            case BigButtonClickType.NONE:
                break;
        }
    };

    useEffect(() => {
        getBoosters()
            .then((res) => setBoosters(res.data));
    }, []);

    return (
        <>
            <SidebarBody pushOnMobile={true}>
                <PageHeader>Market</PageHeader>

                <div className={styles.buttonHolderMobile}>
                    <Button.LittleButton onClick={toggleInstantOpen}>Instant Open: {user.settings.openPacksInstantly ? "On" : "Off"}</Button.LittleButton>
                </div>

                <div className={styles.leftSide}>
                    <BoosterContainer boosters={boosters} />

                    <SearchBox
                        placeholder="Search for a pack..."
                        containerProps={{
                            style: { margin: "20px 5% 10px" }
                        }}
                        buttons={[
                            { icon: !search.onlyPurchasable ? "fas fa-eye" : "fas fa-eye-slash", tooltip: "Only Purchasable", onClick: () => setSearch({ ...search, onlyPurchasable: !search.onlyPurchasable }) },
                            {
                                icon: "fas fa-times", tooltip: "Reset Search", onClick: () => {
                                    localStorage.removeItem("MARKET_SEARCH_QUERY");
                                    setSearch({ ...search, query: "" });
                                }
                            }
                        ]}
                        value={search.query}
                        onChange={(e) => {
                            localStorage.setItem("MARKET_SEARCH_QUERY", e.target.value);

                            setSearch({
                                ...search,
                                query: e.target.value
                            });
                        }}
                    />

                    <Category header={"Packs"} internalName="MARKET_PACKS">
                        <div className={styles.packsWrapper}>
                            {packs.map((pack) =>
                                pack.name.toLowerCase().includes(search.query.toLowerCase())
                                && (!search.onlyPurchasable || user.tokens >= pack.price)
                                && <Pack key={pack.id} pack={pack} onClick={() => {
                                    if (!user.settings.openPacksInstantly) createModal(<OpenPackModal
                                        pack={pack}
                                        userTokens={user.tokens}
                                        onYesButton={() => purchasePack({ packId: pack.id })}
                                    />);
                                    else purchasePack({ packId: pack.id });
                                }} />)}
                        </div>
                    </Category>

                    <Category header="Weekly Shop" internalName="MARKET_WEEKLY_SHOP">
                        <div className={styles.itemShopContainer}>
                            {itemShop.length > 0 ? itemShop.map((entry) => entry.weekly && <Item itemShop={entry} key={entry.id} />) : "There are no items available in this shop."}
                        </div>
                    </Category>

                    <Category header="Item Shop" internalName="MARKET_ITEM_SHOP">
                        <div className={styles.itemShopContainer}>
                            {itemShop.length > 0 ? itemShop.map((entry) => !entry.weekly && <Item itemShop={entry} key={entry.id} />) : "There are no items available in this shop."}
                        </div>
                    </Category>
                </div>
            </SidebarBody>

            <div className={styles.rightSide}>
                <div className={styles.marketContainer}>
                    <img className={styles.rightSideStore} src={window.constructCDNUrl("/content/shopkeeper.png")} alt="Market" />

                    <div className={styles.buttonHolder}>
                        <Button.LittleButton onClick={toggleInstantOpen}>Instant Open: {user.settings.openPacksInstantly ? "On" : "Off"}</Button.LittleButton>
                    </div>
                </div>
            </div>

            {currentPack && <>
                <style>{"body{overflow:hidden}"}</style>

                <div className={styles.openModal}>
                    <div className={styles.openModalBackground}>
                        <img src={resourceIdToPath(currentPack.backgroundId)} alt="Background" />
                    </div>

                    {unlockedBlook && <ParticleCanvas
                        ref={particleCanvasRef}
                        color={
                            rarities.find((rarity) => rarity.id === blooks.find((blook) => blook.id === unlockedBlook.blookId)!.rarityId)!.color
                        }
                        animationType={
                            rarities.find((rarity) => rarity.id === blooks.find((blook) => blook.id === unlockedBlook.blookId)!.rarityId)!.animationType
                        }
                    />}

                    <OpenPackContainer
                        opening={openingPack}
                        image={resourceIdToPath(currentPack.imageId)}
                    />

                    {unlockedBlook && <OpenPackBlook userBlook={unlockedBlook} animate={
                        bigButtonEvent !== BigButtonClickType.OPEN
                    } isNew={isNew(unlockedBlook.blookId)} />}

                    <div style={{ cursor: bigButtonEvent === BigButtonClickType.NONE ? "unset" : "" }} className={styles.openBigButton} onClick={handleBigClick} />
                </div>
            </>}
        </>
    );
}
