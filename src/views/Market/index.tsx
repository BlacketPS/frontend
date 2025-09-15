import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { gainToDb } from "tone";
import { useLoading } from "@stores/LoadingStore";
import { useUser } from "@stores/UserStore/index";
import { useResource } from "@stores/ResourceStore";
import { useModal } from "@stores/ModalStore/index";
import { useSound } from "@stores/SoundStore/index";
import { useData } from "@stores/DataStore/index";
import { useSettings } from "@controllers/settings/useSettings";
import { useOpenPack } from "@controllers/market/useOpenPack";
import { useBoosters } from "@controllers/data/useBoosters";
import { SidebarBody, PageHeader, Modal, Button, SearchBox, ParticleCanvas } from "@components/index";
import type { ParticleCanvasRef } from "@components/ParticleCanvas/particleCanvas.d";
import { OpenPackModal, Category, Pack, OpenPackContainer, OpenPackBlook, Item, BoosterContainer } from "./components";
import styles from "./market.module.scss";

import { DataBoostersEntity, MarketOpenPackDto, Pack as PackType, RarityAnimationTypeEnum, UserBlook } from "@blacket/types";
import { BigButtonClickType, LittleButton, SearchOptions } from "./market.d";

// TODO: can't hear so i will see if this is right

export default function Market() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { resourceIdToPath } = useResource();
    const { playSound, stopSounds, defineSounds, setVolume, getSound } = useSound();
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

    const playRaritySound = async (r: RarityAnimationTypeEnum) => {
        if (!user.settings) return;

        let sound = "";

        switch (r) {
            case RarityAnimationTypeEnum.COMMON:
                sound = "common"; break;
            case RarityAnimationTypeEnum.RARE:
                sound = "rare"; break;
            case RarityAnimationTypeEnum.EPIC:
                sound = "epic"; break;
            case RarityAnimationTypeEnum.LEGENDARY:
                sound = "legendary"; break;
            default:
                return;
        }

        if (user.settings.onlyRareSounds && sound !== "legendary") return;

        playSound(sound);
    };

    const stopRaritySound = () => {
        stopSounds(["common", "rare", "epic", "legendary"]);
    };

    const setAmbienceSound = async (pack: PackType) => {
        setVolume(`pack-ambience-${pack.id}`, gainToDb(0.1));

        for (const p of packs.filter((p) => p.id !== pack.id && p.ambienceId)) {
            setVolume(`pack-ambience-${p.id}`, -Infinity);
        }
    };

    const muteAmbience = async () => {
        setVolume(`pack-ambience-${currentPack?.id}`, -Infinity);
    };

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
                const pack = packs.find((pack: PackType) => pack.id === dto.packId);
                if (!pack) {
                    createModal(<Modal.ErrorModal>Pack not found.</Modal.ErrorModal>);
                    return reject(new Error("Pack not found"));
                }

                setCurrentPack(pack);
                setAmbienceSound(pack);

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
                setBigButtonEvent(BigButtonClickType.OPENING);

                await new Promise((r) => {
                    let waitTime = 700;

                    setTimeout(() => {
                        playRaritySound(rarity.animationType as RarityAnimationTypeEnum);
                    }, 500);

                    let particleDelay = 0;
                    if (rarity.animationType === RarityAnimationTypeEnum.CHROMA) particleDelay = 5000;
                    if (rarity.animationType === RarityAnimationTypeEnum.MYTHICAL) particleDelay = 9000;

                    setTimeout(() => {
                        particleCanvasRef.current?.start();
                    }, particleDelay);

                    if (rarity.animationType === RarityAnimationTypeEnum.LEGENDARY) waitTime += 1300;
                    if (rarity.animationType === RarityAnimationTypeEnum.CHROMA) waitTime += 8000;
                    if (rarity.animationType === RarityAnimationTypeEnum.MYTHICAL) waitTime += 20000;
                    if (unlockedBlook.shiny) waitTime += 2000;

                    setTimeout(() => {
                        r(true);
                    }, waitTime);
                });

                setBigButtonEvent(BigButtonClickType.CLOSE);
                break;

            case BigButtonClickType.CLOSE:
                stopRaritySound();
                muteAmbience();

                particleCanvasRef.current?.stop();

                setCurrentPack(null);
                setUnlockedBlook(null);
                setOpeningPack(false);

                break;

            default:
                break;
        }
    };

    useEffect(() => {
        getBoosters()
            .then((res) => setBoosters(res.data));

        defineSounds([
            { id: "common", url: window.constructCDNUrl("/content/audio/sound/pack/common.mp3") },
            { id: "rare", url: window.constructCDNUrl("/content/audio/sound/pack/rare.mp3") },
            { id: "epic", url: window.constructCDNUrl("/content/audio/sound/pack/epic.mp3") },
            { id: "legendary", url: window.constructCDNUrl("/content/audio/sound/pack/legendary.mp3") },
            { id: "shiny", url: window.constructCDNUrl("/content/audio/sound/pack/shiny.mp3") }
        ]);

        for (const pack of packs) {
            if (!pack.ambienceId) continue;

            defineSounds([{
                id: `pack-ambience-${pack.id}`,
                url: resourceIdToPath(pack.ambienceId!),
                options: {
                    loop: true,
                    volume: gainToDb(0.1),
                    preload: true
                }
            }]);
        }

        return () => {
            stopSounds(["common", "rare", "epic", "legendary"]);
            stopSounds(packs.map((pack) => `pack-ambience-${pack.id}`));

            particleCanvasRef.current?.stop();
        };
    }, []);

    const LITTLE_BUTTONS: LittleButton[] = [
        {
            children: <>Instant Open: {user.settings.openPacksInstantly ? "On" : "Off"}</>,
            onClick: toggleInstantOpen
        },
        {
            children: <>Convert Diamonds</>,
            onClick: () => { }
        }
    ];

    return (
        <>
            <SidebarBody pushOnMobile={true}>
                <PageHeader>Market</PageHeader>

                <div className={styles.buttonHolderMobile}>
                    {LITTLE_BUTTONS.map((button, index) => <Button.LittleButton key={index} onClick={button.onClick}>{button.children}</Button.LittleButton>)}
                </div>

                <div className={styles.leftSide}>
                    <BoosterContainer boosters={boosters} />

                    <SearchBox
                        placeholder="Search for a pack or item..."
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

                    <Category header={"Packs"}>
                        <div className={styles.packsWrapper}>
                            {packs
                                .filter((pack) => pack.enabled)
                                .map((pack) =>
                                    <Pack key={pack.id} pack={pack} ambienceEnabled={!currentPack} onClick={() => {
                                        if (!user.settings.openPacksInstantly) createModal(<OpenPackModal
                                            pack={pack}
                                            userTokens={user.tokens}
                                            onYesButton={() => purchasePack({ packId: pack.id })}
                                        />);
                                        else purchasePack({ packId: pack.id });
                                    }}
                                        style={{
                                            display: pack.name.toLowerCase().includes(search.query.toLowerCase())
                                                && (!search.onlyPurchasable || user.tokens >= pack.price)
                                                ? "block"
                                                : "none"
                                        }}
                                    />)}

                            {!packs.some((pack) =>
                                pack.name.toLowerCase().includes(search.query.toLowerCase())
                                && (!search.onlyPurchasable || user.tokens >= pack.price)
                            ) && "No packs found."}
                        </div>
                    </Category>

                    <Category header="Weekly Shop">
                        <div className={styles.itemShopContainer}>
                            {/* TODO: weekly shop */}
                            {itemShop.length > 0 ? itemShop.map((entry) => entry.weekly && <Item itemShop={entry} key={entry.id} />) : "No items found."}
                        </div>
                    </Category>

                    <Category header="Item Shop">
                        <div className={styles.itemShopContainer}>
                            {/* TODO: item shop */}
                            {itemShop.length > 0 ? itemShop.map((entry) => !entry.weekly && <Item itemShop={entry} key={entry.id} />) : "No items found."}
                        </div>
                    </Category>
                </div>
            </SidebarBody>

            <div className={styles.rightSide}>
                <div className={styles.marketContainer}>
                    <img className={styles.rightSideStore} src={window.constructCDNUrl("/content/shopkeeper.png")} alt="Shopkeeper" />

                    <div className={styles.buttonHolder}>
                        {LITTLE_BUTTONS.map((button, index) => <Button.LittleButton key={index} onClick={button.onClick}>{button.children}</Button.LittleButton>)}
                    </div>
                </div>
            </div>

            {currentPack && <>
                <style>{"body{overflow:hidden}"}</style>

                <div className={styles.openModal}>
                    <div className={styles.openModalBackground}>
                        <img src={resourceIdToPath(currentPack.backgroundId)} />
                    </div>

                    {unlockedBlook && <>
                        <ParticleCanvas
                            ref={particleCanvasRef}
                            color={
                                rarities.find((rarity) => rarity.id === blooks.find((blook) => blook.id === unlockedBlook.blookId)!.rarityId)!.color
                            }
                            animationType={
                                rarities.find((rarity) => rarity.id === blooks.find((blook) => blook.id === unlockedBlook.blookId)!.rarityId)!.animationType
                            }
                            images={[
                                window.constructCDNUrl("/content/particles/1.png"),
                                window.constructCDNUrl("/content/particles/2.png"),
                                window.constructCDNUrl("/content/particles/3.png"),
                                window.constructCDNUrl("/content/particles/4.png"),
                                window.constructCDNUrl("/content/particles/5.png"),
                                window.constructCDNUrl("/content/particles/6.png"),
                                window.constructCDNUrl("/content/particles/7.png"),
                                window.constructCDNUrl("/content/particles/8.png")
                            ]}
                            className={styles.canvas}
                        />

                        <OpenPackContainer
                            opening={openingPack}
                            image={resourceIdToPath(currentPack.imageId)}
                            video={
                                blooks.find((blook) => blook.id === unlockedBlook.blookId)!.videoId
                                    ? resourceIdToPath(blooks.find((blook) => blook.id === unlockedBlook.blookId)!.videoId!)
                                    : undefined
                            }
                            animationType={rarities.find((rarity) => rarity.id === blooks.find((blook) => blook.id === unlockedBlook.blookId)!.rarityId)!.animationType}
                        />
                    </>}

                    {unlockedBlook && <OpenPackBlook userBlook={unlockedBlook} animate={
                        bigButtonEvent === BigButtonClickType.OPENING || bigButtonEvent === BigButtonClickType.CLOSE
                    } isNew={isNew(unlockedBlook.blookId)} />}

                    <div style={{ cursor: bigButtonEvent === BigButtonClickType.NONE ? "unset" : "" }} className={styles.openBigButton} onClick={handleBigClick} />
                </div>
            </>}
        </>
    );
}
