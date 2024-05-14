import { useState, useEffect, useRef, RefObject } from "react";
import { Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore";
import { useUser } from "@stores/UserStore";
import { useModal } from "@stores/ModalStore";
import { usePack } from "@stores/PackStore/index";
import { useSettings } from "@controllers/settings/useSettings";
import { Modal, Button } from "@components/index";
import { OpenPackModal, Category, Pack } from "./components";
import { Game, Scale, WEBGL } from "phaser";
import Particles from "./functions/PackParticles";
import styles from "./market.module.scss";

import { Pack as PackType } from "blacket-types";

type ParticlesScene = Phaser.Scene & {
    initParticles: () => void;
    game: Game;
};

type Config = {
    type: number;
    parent: string | HTMLDivElement | null;
    width: string;
    height: string;
    transparent: boolean;
    scale: { mode: number; autoCenter: number };
    physics: { default: string };
    scene: ParticlesScene;
};

type GameState = {
    type: number;
    parent: string;
    width: string;
    height: string;
    transparent: boolean;
    scale: { mode: number; autoCenter: number; };
    physics: { default: string; };
    scene: ParticlesScene;
};

const useGame = (config: Config, containerRef: RefObject<HTMLDivElement>) => {
    const [game, setGame] = useState<Game | null>(null);
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
    const [game, setGame] = useState<GameState>({
        type: WEBGL,
        parent: "phaser-market",
        width: "100%",
        height: "100%",
        transparent: true,
        scale: { mode: Scale.NONE, autoCenter: Scale.CENTER_BOTH },
        physics: { default: "arcade" },
        scene: {
            game: {} as Game,
            initParticles: () => { }
        } as ParticlesScene
    });
    const [openingPack, setOpeningPack] = useState<boolean>(false);

    const gameRef = useRef<HTMLDivElement>(null);

    useGame(game, gameRef);

    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { packs } = usePack();

    const { changeSetting } = useSettings();

    const toggleInstantOpen = () => {
        setLoading("Changing settings");
        changeSetting({ key: "openPacksInstantly", value: !user.settings.openPacksInstantly })
            .then(() => setLoading(false))
            .catch(() => createModal(<Modal.ErrorModal>Failed to change settings.</Modal.ErrorModal>))
            .finally(() => setLoading(false));
    };

    const purchasePack = () => new Promise<void>((resolve, reject) => {
        setGame({
            type: WEBGL, parent: "phaser-market", width: "100%", height: "100%", transparent: true,
            scale: { mode: Scale.NONE, autoCenter: Scale.CENTER_BOTH },
            physics: { default: "arcade" },
            scene: new Particles(1, "#ffffff") as ParticlesScene
        });
        setOpeningPack(true);

        resolve();
    });

    const handleBigClick = async () => {
        await new Promise((r) => setTimeout(r, 500));
        game?.scene.game.events.emit("start-particles", 1);
    };

    return (
        <>
            <div className={styles.buttonHolder}>
                <Button.LittleButton onClick={toggleInstantOpen}>Instant Open: {user.settings.openPacksInstantly ? "On" : "Off"}</Button.LittleButton>
            </div>

            <Category header={`Packs (${packs.length})`} internalName="MARKET_PACKS">
                <div className={styles.packsWrapper}>
                    {packs.map((pack: PackType) => <Pack key={pack.id} pack={pack} onClick={() => {
                        if (!user.settings.openPacksInstantly) createModal(<OpenPackModal
                            packId={pack.id}
                            userTokens={user.tokens}
                            onYesButton={() => purchasePack()} />
                        );
                        else purchasePack();
                    }} />)}
                </div>
            </Category>

            <Category header="Weekly Shop" internalName="MARKET_WEEKLY_SHOP">
                There are no items in the weekly shop.
            </Category>

            <Category header="Item Shop" internalName="MARKET_ITEM_SHOP">
                There are no items in the item shop.
            </Category>

            <button onClick={handleBigClick}>Big Button</button>

            {openingPack && <div ref={gameRef} className={styles.phaserContainer} />}
        </>
    );
}
