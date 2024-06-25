import { useState, useEffect, useRef, RefObject } from "react";
import { Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore";
import { useUser } from "@stores/UserStore/index";
import { useResource } from "@stores/ResourceStore";
import { useModal } from "@stores/ModalStore/index";
import { usePack } from "@stores/PackStore/index";
import { useRarity } from "@stores/RarityStore/index";
import { useBlook } from "@stores/BlookStore/index";
import { useSettings } from "@controllers/settings/useSettings";
import { useOpenPack } from "@controllers/market/useOpenPack";
import { SidebarBody, PageHeader, Modal, Button } from "@components/index";
import { OpenPackModal, Category, Pack, OpenPackContainer, OpenPackBlook } from "./components";
// @ts-expect-error phaser is too big for the bundle so import it externally since its only used once
const { Game, Scale, WEBGL } = window.Phaser;
import Particles from "./functions/PackParticles";
import styles from "./market.module.scss";

import { Blook, OpenPackDto, Pack as PackType } from "blacket-types";
import { ParticlesScene, Config, GameState, BigButtonClickType } from "./market.d";

const useGame = (config: Config, containerRef: RefObject<HTMLDivElement>) => {
    const [game, setGame] = useState<typeof Game | null>(null);
    const oldConfig = useRef<Config | null>(null);

    useEffect(() => {
        if ((!game && containerRef.current) || config !== oldConfig.current) {
            if (!containerRef.current) return;
            oldConfig.current = config;
            const newGame = new Game({ ...config, parent: containerRef.current });
            config.scene.game = newGame;
            config.scene.initParticles();
            setGame(newGame);
        }
        return () => {
            game?.destroy(true);
        };
    }, [config, containerRef, game]);

    return game;
};

export default function Market() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { resourceIdToPath } = useResource();
    const { packs } = usePack();
    const { rarities } = useRarity();
    const { blooks } = useBlook();

    if (!user) return <Navigate to="/login" />;

    const { changeSetting } = useSettings();
    const { openPack } = useOpenPack();

    const [game, setGame] = useState<GameState>({
        type: WEBGL,
        parent: "phaser-market",
        width: "100%",
        height: "100%",
        transparent: true,
        scale: { mode: Scale.NONE, autoCenter: Scale.CENTER_BOTH },
        physics: { default: "arcade" },
        scene: {
            game: {} as typeof Game,
            initParticles: () => { }
        } as ParticlesScene
    });
    const [currentPack, setCurrentPack] = useState<any | null>(null);
    const [openingPack, setOpeningPack] = useState<boolean>(false);

    const [unlockedBlook, setUnlockedBlook] = useState<Blook | null>(null);

    const [bigButtonEvent, setBigButtonEvent] = useState<BigButtonClickType>(BigButtonClickType.CLOSE);

    const gameRef = useRef<HTMLDivElement>(null);

    useGame(game, gameRef);

    const toggleInstantOpen = () => {
        setLoading("Changing settings");
        changeSetting({ key: "openPacksInstantly", value: !user.settings.openPacksInstantly })
            .then(() => setLoading(false))
            .catch(() => createModal(<Modal.ErrorModal>Failed to change settings.</Modal.ErrorModal>))
            .finally(() => setLoading(false));
    };

    const purchasePack = (dto: OpenPackDto) => new Promise<void>((resolve, reject) => {
        if (user.settings.openPacksInstantly && user.tokens < packs.find((pack) => pack.id === dto.packId)!.price) {
            return reject(createModal(<Modal.ErrorModal>You do not have enough tokens to purchase this pack.</Modal.ErrorModal>));
        }

        if (user.settings.openPacksInstantly) setLoading(`Opening ${packs.find((pack) => pack.id === dto.packId)!.name} pack`);

        openPack(dto)
            .then((res) => {
                const blook = blooks.find((blook) => blook.id === res.data.id)!;
                const rarity = rarities.find((rarity) => rarity.id === blook.rarityId)!;

                setGame({
                    type: WEBGL, parent: "phaser-market", width: "100%", height: "100%", transparent: true,
                    scale: { mode: Scale.NONE, autoCenter: Scale.CENTER_BOTH },
                    physics: { default: "arcade" },
                    scene: new Particles(rarity.animationType, rarity.color) as ParticlesScene
                });
                setBigButtonEvent(BigButtonClickType.OPEN);
                setCurrentPack(packs.find((pack: PackType) => pack.id === dto.packId));

                resolve(setUnlockedBlook(blooks.find((blook) => blook.id === res.data.id)!));
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

        const rarity = rarities.find((rarity) => rarity.id === unlockedBlook.rarityId)!;

        switch (bigButtonEvent) {
            case BigButtonClickType.OPEN:
                setOpeningPack(true);

                setBigButtonEvent(BigButtonClickType.NONE);

                await new Promise((r) => setTimeout(r, 250));
                game?.scene.game.events.emit("start-particles", rarity.animationType);

                await new Promise((r) => setTimeout(r, rarity.animationType < 3 ? 650 : 1250));
                setBigButtonEvent(BigButtonClickType.CLOSE);

                break;
            case BigButtonClickType.CLOSE:
                setCurrentPack(null);
                setUnlockedBlook(null);
                setOpeningPack(false);

                break;
            case BigButtonClickType.NONE:
                break;
        }
    };

    return (
        <>
            <SidebarBody>
                <PageHeader>Market</PageHeader>

                <div className={styles.buttonHolder}>
                    <Button.LittleButton onClick={toggleInstantOpen}>Instant Open: {user.settings.openPacksInstantly ? "On" : "Off"}</Button.LittleButton>
                </div>

                <Category header={`Packs (${packs.length})`} internalName="MARKET_PACKS">
                    <div className={styles.packsWrapper}>
                        {packs.map((pack) => <Pack key={pack.id} pack={pack} onClick={() => {
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
                    There are no items in the weekly shop.
                </Category>

                <Category header="Item Shop" internalName="MARKET_ITEM_SHOP">
                    There are no items in the item shop.
                </Category>
            </SidebarBody>

            {
                currentPack && <div className={styles.openModal} style={{
                    background: `radial-gradient(circle, ${currentPack.innerColor} 0%, ${currentPack.outerColor} 100%)`
                }}>
                    <div ref={gameRef} className={styles.phaserContainer} />
                    <OpenPackContainer opening={openingPack} image={resourceIdToPath(currentPack.imageId)} />
                    {unlockedBlook && <OpenPackBlook blook={unlockedBlook} animate={
                        bigButtonEvent !== BigButtonClickType.OPEN
                    } isNew={user.blooks?.[unlockedBlook.id] === 1} />}
                    <div style={{ cursor: bigButtonEvent === BigButtonClickType.NONE ? "unset" : "" }} className={styles.openBigButton} onClick={handleBigClick} />
                </div>
            }
        </>
    );
}
