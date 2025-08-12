import { useEffect, useLayoutEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { gainToDb } from "tone";
import { BrenderCanvas, BrenderCanvasRef, BrenderEntity, isColliding, isOnScreen, PlayerEntity, urlToImage } from "@brender/index";
import { useUser } from "@stores/UserStore/index";
import { useSocket } from "@stores/SocketStore/index";
import { useData } from "@stores/DataStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useSound } from "@stores/SoundStore/index";
import { Joystick, WaterBackground } from "@components/index";
import { MobileRunButton } from "./components";
import { lerp } from "@functions/core/mathematics";
import styles from "./tradingPlaza.module.scss";

import { SocketMessageType } from "@blacket/types";
import { TILES } from "@constants/index";

export default function TradingPlaza() {
    const { user, getUserAvatarPath } = useUser();
    const { socket, connected, latency } = useSocket();
    const { fontIdToName } = useData();
    const { addCachedUser } = useCachedUser();
    const { playSound, defineSounds, stopSound } = useSound();

    if (!user) return <Navigate to="/login" />;

    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);
    const waterBackgroundRef = useRef<HTMLDivElement>(null);

    const stepSounds = [
        "step-1",
        "step-2",
        "step-3",
        "step-4",
        "step-5"
    ];

    useEffect(() => {
        defineSounds([
            {
                id: "trading-plaza-ambience",
                url: window.constructCDNUrl("/content/audio/sound/trading-plaza/ambience.mp3"),
                options: {
                    loop: true,
                    preload: true,
                    volume: gainToDb(0.5)
                }
            },
            ...stepSounds.map((sound) => ({
                id: sound,
                url: window.constructCDNUrl(`/content/audio/sound/trading-plaza/${sound}.mp3`),
                options: { volume: gainToDb(0.5) }
            }))
        ])
            .then(() => {
                playSound("trading-plaza-ambience");
            });

        return () => {
            stopSound("trading-plaza-ambience");
        };
    }, [defineSounds, playSound]);

    useLayoutEffect(() => {
        if (!socket) return;

        const brender = brenderCanvasRef.current;
        if (!brender) return;

        let active = true;

        const MOVEMENT_KEYS = {
            UP: ["w", "arrowup"],
            LEFT: ["a", "arrowleft"],
            DOWN: ["s", "arrowdown"],
            RIGHT: ["d", "arrowright"],
            RUN: ["shift"]
        };

        const PLAYER_SPEED = (window.innerWidth < 1024 ? 8 : 10);
        const FOOTSTEP_INTERVAL = 350 / (PLAYER_SPEED / 10);
        const TILE_SIZE = 50;
        const COLUMNS = 35;
        const ROWS = 40;

        let _previousPos = { x: 0, y: 0 };
        let _lastFootstep = 0;

        let sprinting = false;

        const tiles = TILES.filter((tile) => tile.id.includes("grass"));

        for (let x = -ROWS; x < ROWS; x++) {
            for (let y = -COLUMNS; y < COLUMNS; y++) {
                let key: string = "";
                let tile = tiles[0];

                const chanceSum = TILES.reduce((sum, tile) => sum + (tile?.chance ?? 1), 0);
                const randomChance = Math.random() * chanceSum;

                let accumulatedChance = 0;
                for (const tile2 of tiles) {
                    accumulatedChance += tile2.chance!;

                    if (randomChance < accumulatedChance) {
                        key = tile2.id;
                        tile = tile2;

                        break;
                    }
                }

                const realX = x * TILE_SIZE;
                const realY = y * TILE_SIZE;

                urlToImage(tile.image).then((image) => {
                    brender.createObject({
                        id: `${key}-${realX}-${realY}`,
                        x: realX,
                        y: realY,
                        z: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        image
                    });
                });
            }
        }

        socket.emit(SocketMessageType.TRADING_PLAZA_JOIN);

        // const loadMap = async () => {
        //     // @ts-ignore temporary
        //     for (const o of window.map) {
        //         // const image = o.image ? await brender.urlToImage(o.image) : undefined;

        //         // brender.createObject({
        //         //     id: o.id,
        //         //     x: o.x,
        //         //     y: o.y,
        //         //     z: o.z,
        //         //     width: o.width,
        //         //     height: o.height,
        //         //     image
        //         // });

        //         const tile = TILES.find((tile) => tile.id === o.id.split(" ")[0]) ?? undefined;
        //         if (!tile) continue;

        //         const image = tile.image ? await brender.urlToImage(tile.image) : undefined;

        //         brender.createObject({
        //             id: o.id,
        //             x: o.x,
        //             y: o.y,
        //             z: 0,
        //             width: tile.width,
        //             height: tile.height,
        //             image
        //         });
        //     }
        // };

        // loadMap();

        const renderPlayerText = (entity: PlayerEntity, z: number = 0) => {
            const center = entity.x + (entity?.width ?? 300) / 2;

            brender.drawText({
                text: entity.user.username,
                x: center,
                y: entity.y + (entity?.height ?? 345 / 6) + 20,
                z,
                style: {
                    fontFamily: fontIdToName(entity.user.fontId) ?? "Nunito Bold",
                    fontSize: 20,
                    textAlign: "center",
                    color: entity.user.color
                }
            });
        };

        const createPlayerEntity = async (userId: string) => {
            const entity = brender.createPlayerEntity({
                id: userId,
                x: 0,
                y: 0,
                z: 1,
                image: brender.loadingImage,
                width: 300 / 6,
                height: 345 / 6,
                targetEasingSpeed: 0.1,
                user: {
                    id: userId,
                    username: "",
                    fontId: 1,
                    color: "#ffffff"
                } as any,
                onFrame: async (entity, deltaTime) => {
                    renderPlayerText(entity);

                    entity.x = lerp(entity.x, entity?.targetX ?? 0, (entity?.targetEasingSpeed ?? 0.1 * deltaTime));
                    entity.y = lerp(entity.y, entity?.targetY ?? 0, (entity?.targetEasingSpeed ?? 0.1 * deltaTime));
                }
            });

            const user = await addCachedUser(userId);
            if (!user) return entity.destroy?.();

            entity.user = user;

            brender.urlToImage(getUserAvatarPath(user))
                .then((image) => {
                    entity.image = image;
                    if (user?.avatar?.shiny) entity.imageShiny = true;

                    entity.width = 300 / 6;
                    entity.height = 345 / 6;
                });

            return entity;
        };

        const handleJoin = async (data: { userId: string }) => createPlayerEntity(data.userId);

        const handleMove = async (data: { userId: string, x: number, y: number }) => {
            if (data.userId === user.id) return;

            const entity = brender.findEntity(data.userId);
            if (!entity) return createPlayerEntity(data.userId);

            entity.targetX = data.x;
            entity.targetY = data.y;
        };

        const handleLeave = (data: { userId: string }) => brender.findEntity(data.userId)?.destroy?.();

        const handleLagback = (data: { x: number, y: number }) => {
            const player = brender.findEntity(user.id) as PlayerEntity;
            if (!player) return;

            player.x = data.x;
            player.y = data.y;
        };

        socket.on(SocketMessageType.TRADING_PLAZA_JOIN, handleJoin);
        socket.on(SocketMessageType.TRADING_PLAZA_MOVE, handleMove);
        socket.on(SocketMessageType.TRADING_PLAZA_LEAVE, handleLeave);
        socket.on(SocketMessageType.LAGBACK, handleLagback);

        const player = brender.createPlayerEntity({
            id: user.id,
            x: 0,
            y: 0,
            z: 10,
            image: brender.loadingImage,
            width: 300 / 6,
            height: 345 / 6,
            user,
            hasCollision: true,
            onFrame: (entity, deltaTime) => {
                renderPlayerText(entity, 10);

                let moveX = 0;
                let moveY = 0;

                if (MOVEMENT_KEYS.UP.some((key) => brender.pressing[key])) moveY -= PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.LEFT.some((key) => brender.pressing[key])) moveX -= PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.DOWN.some((key) => brender.pressing[key])) moveY += PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.RIGHT.some((key) => brender.pressing[key])) moveX += PLAYER_SPEED * deltaTime;

                if (MOVEMENT_KEYS.RUN.some((key) => brender.pressing[key])) {
                    moveX *= 1.5;
                    moveY *= 1.5;

                    sprinting = true;
                } else {
                    sprinting = false;
                }

                if (moveX !== 0 && moveY !== 0) {
                    moveX /= Math.SQRT2;
                    moveY /= Math.SQRT2;
                }

                const nextX = (entity.x + moveX) | 0;
                const nextY = (entity.y + moveY) | 0;

                // object collision checks
                const objects = brender.objects.filter((object) => isOnScreen(object.x, object.y, object.width!, object.height!));
                for (const object of objects) {
                    if (isColliding({ ...entity, x: nextX } as BrenderEntity, object)) {
                        const diffX = entity.x - object.x;

                        if (diffX > 0) moveX = Math.max(0, moveX);
                        if (diffX < 0) moveX = Math.min(0, moveX);
                    }

                    if (isColliding({ ...entity, y: nextY } as BrenderEntity, object)) {
                        const diffY = entity.y - object.y;

                        if (diffY > 0) moveY = Math.max(0, moveY);
                        if (diffY < 0) moveY = Math.min(0, moveY);
                    }
                }

                // entity collision checks
                const entities = brender.entities.filter((entity) => entity.id !== user.id);
                for (const entity2 of entities) {
                    if (isColliding({ ...entity, x: nextX } as BrenderEntity, entity2)) {
                        const diffX = entity.x - entity2.x;

                        if (diffX > 0) moveX = Math.max(0, moveX);
                        if (diffX < 0) moveX = Math.min(0, moveX);
                    }

                    if (isColliding({ ...entity, y: nextY } as BrenderEntity, entity2)) {
                        const diffY = entity.y - entity2.y;

                        if (diffY > 0) moveY = Math.max(0, moveY);
                        if (diffY < 0) moveY = Math.min(0, moveY);
                    }
                }

                _previousPos = { x: entity.x, y: entity.y };

                brender.camera.focusOn(entity as BrenderEntity, (window.innerWidth < 1024 ? 0.15 : 0.1) * deltaTime);

                entity.x += moveX | 0;
                entity.y += moveY | 0;

                waterBackgroundRef.current?.style.setProperty("background-position", `${-brender.camera.x}px ${-brender.camera.y}px`);
            }
        });

        brender.urlToImage(getUserAvatarPath(user))
            .then((image) => {
                player.image = image;
                if (user?.avatar?.shiny) player.imageShiny = true;

                player.width = 300 / 6;
                player.height = 345 / 6;
            });

        const movementLoop = () => {
            if (!active) return;

            const now = Date.now();
            const isMoving = player.x !== _previousPos.x || player.y !== _previousPos.y;

            if (isMoving) {
                if (now - _lastFootstep > FOOTSTEP_INTERVAL / (sprinting ? 1.5 : 1)) {
                    const sound = `step-${Math.floor(Math.random() * 5) + 1}`;

                    playSound(sound);

                    _lastFootstep = now;
                }

                socket.emit(SocketMessageType.TRADING_PLAZA_MOVE, { x: player.x, y: player.y });

                _previousPos.x = player.x;
                _previousPos.y = player.y;
            }

            setTimeout(movementLoop, 1000 / 20);
        };

        movementLoop();

        (async () => {
            brender.createObject({
                id: "spawn",
                x: 0,
                y: 0,
                z: 0,
                image: (await brender.urlToImage(window.constructCDNUrl("/content/trading-plaza/spawn.png"))),
                width: 500,
                height: 500,
                hasCollision: false
            });
        })();

        return () => {
            active = false;

            player.destroy?.();

            socket.emit(SocketMessageType.TRADING_PLAZA_LEAVE);

            socket.off(SocketMessageType.TRADING_PLAZA_JOIN, handleJoin);
            socket.off(SocketMessageType.TRADING_PLAZA_MOVE, handleMove);
            socket.off(SocketMessageType.TRADING_PLAZA_LEAVE, handleLeave);

            socket.off(SocketMessageType.LAGBACK, handleLagback);
        };
    }, [socket]);

    return (
        <div
            className={styles.container}
            onContextMenu={(e) => e.preventDefault()}
        >
            <WaterBackground ref={waterBackgroundRef} />

            {socket && <BrenderCanvas
                ref={brenderCanvasRef}
                className={styles.canvas}
                debug={true}
                showFPS={true}
            />}

            <div className={styles.ui}>
                <div
                    className={styles.topLeft}
                >
                    {connected ? "Connected to Trading Plaza" : "Disconnected from Trading Plaza"}
                    <br />
                    <div style={{ color: latency < 100 ? "unset" : latency < 200 ? "yellow" : "red" }}>Ping: {latency}ms</div>
                </div>
            </div>

            <MobileRunButton
                onPress={() => {
                    const brender = brenderCanvasRef.current;
                    if (!brender) return;

                    brender.pressing["shift"] = true;
                }}
                onRelease={() => {
                    const brender = brenderCanvasRef.current;
                    if (!brender) return;

                    brender.pressing["shift"] = false;
                }}
            />

            <Joystick onMove={(a) => {
                const brender = brenderCanvasRef.current;
                if (!brender) return;

                const direction = {
                    x: Math.cos(a),
                    y: Math.sin(a)
                };

                brender.pressing["w"] = direction.y < -0.5;
                brender.pressing["s"] = direction.y > 0.5;
                brender.pressing["a"] = direction.x < -0.5;
                brender.pressing["d"] = direction.x > 0.5;
            }}
                onStop={() => {
                    const brender = brenderCanvasRef.current;
                    if (!brender) return;

                    brender.pressing["w"] = false;
                    brender.pressing["s"] = false;
                    brender.pressing["a"] = false;
                    brender.pressing["d"] = false;
                }}
            />
        </div >
    );
}
