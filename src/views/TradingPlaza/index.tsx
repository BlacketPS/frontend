import { useLayoutEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { BrenderCanvas, BrenderCanvasRef, PlayerEntity } from "@brender/index";
import { useUser } from "@stores/UserStore/index";
import { useSocket } from "@stores/SocketStore/index";
import { useData } from "@stores/DataStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { lerp } from "@functions/core/mathematics";
import styles from "./tradingPlaza.module.scss";

import { SocketMessageType } from "@blacket/types";
import { Tile } from "./tradingPlaza.d";

export default function TradingPlaza() {
    const { user, getUserAvatarPath } = useUser();
    const { socket, connected, latency } = useSocket();
    const { fontIdToName } = useData();
    const { addCachedUser } = useCachedUser();

    if (!user) return <Navigate to="/login" />;

    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);

    const tiles: Tile[] = [
        { id: "grass-1", image: window.constructCDNUrl("/content/trading-plaza/grass-1.png"), chance: 0.1 },
        { id: "grass-2", image: window.constructCDNUrl("/content/trading-plaza/grass-2.png"), chance: 0.005 },
        { id: "grass-3", image: window.constructCDNUrl("/content/trading-plaza/grass-3.png"), chance: 0.005, flippable: true },
        { id: "grass-4", image: window.constructCDNUrl("/content/trading-plaza/grass-4.png"), chance: 0.005, flippable: true },
        { id: "grass-5", image: window.constructCDNUrl("/content/trading-plaza/grass-5.png"), chance: 0.001 },
        { id: "grass-6", image: window.constructCDNUrl("/content/trading-plaza/grass-6.png"), chance: 0.0025, flippable: true }
    ];

    for (const tile of tiles.filter((tile) => typeof tile.image === "string")) {
        const image = new Image();
        image.src = tile.image as string;

        tile.image = image;
    }

    useLayoutEffect(() => {
        if (!socket) return;

        const brender = brenderCanvasRef.current;
        if (!brender) return;

        const MOVEMENT_KEYS = {
            UP: ["w", "arrowup"],
            LEFT: ["a", "arrowleft"],
            DOWN: ["s", "arrowdown"],
            RIGHT: ["d", "arrowright"]
        };

        const PLAYER_SPEED = 5;
        const TILE_SIZE = 50;
        const COLUMNS = 50;
        const ROWS = 50;

        let _previousPos = { x: 0, y: 0 };

        for (let x = -ROWS; x < ROWS; x++) {
            for (let y = -COLUMNS; y < COLUMNS; y++) {
                let key: string = "";
                let tile = tiles[0];

                const chanceSum = tiles.reduce((sum, tile) => sum + tile.chance, 0);
                const randomChance = Math.random() * chanceSum;

                let accumulatedChance = 0;
                for (const tile2 of tiles) {
                    accumulatedChance += tile2.chance;

                    if (randomChance < accumulatedChance) {
                        key = tile2.id;
                        tile = tile2;

                        break;
                    }
                }

                const realX = x * TILE_SIZE;
                const realY = y * TILE_SIZE;

                brender.createObject({
                    id: `${key}-${realX}-${realY}`,
                    x: realX,
                    y: realY,
                    z: 0,
                    width: TILE_SIZE + 1,
                    height: TILE_SIZE + 1,
                    image: tile.image as HTMLImageElement
                });
            }
        }

        socket.emit(SocketMessageType.TRADING_PLAZA_JOIN);

        const renderPlayerText = (entity: PlayerEntity, debug?: boolean) => {
            const center = entity.x + (entity?.width ?? 300) / 2;

            // brender.renderText(
            //     entity.user.username,
            //     center,
            //     entity.y + 77,
            //     {
            //         fontFamily: fontIdToName(entity.user.fontId) ?? "Nunito Bold",
            //         fontSize: 20,
            //         textAlign: "center",
            //         color: entity.user.color
            //     }
            // );

            brender.drawText({
                text: entity.user.username,
                x: center,
                y: entity.y + 77,
                style: {
                    fontFamily: fontIdToName(entity.user.fontId) ?? "Nunito Bold",
                    fontSize: 20,
                    textAlign: "center",
                    color: entity.user.color
                }
            });

            // if (debug) {
            //     brender.renderText(
            //         `Player Position: ${entity.x}, ${entity.y}`,
            //         7,
            //         75,
            //         {
            //             fontFamily: "Nunito",
            //             color: "white"
            //         },
            //         false
            //     );
            // }
        };

        const createPlayerEntity = async (userId: string) => {
            const entity = brender.createPlayerEntity({
                id: userId,
                x: 0,
                y: 0,
                z: 4,
                image: brender.loadingImage,
                width: 300 / 6,
                height: 345 / 6,
                targetEasingSpeed: 0.15,
                user: {
                    id: userId,
                    username: "",
                    fontId: 1,
                    color: "#ffffff"
                } as any,
                onFrame: (entity, deltaTime) => {
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
                    entity.width = image.width / 6;
                    entity.height = image.height / 6;
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

        const overlay = brender.createObject({
            id: "overlay",
            x: 0,
            y: 0,
            z: 10,
            imageBlendMode: "overlay",
            imageOpacity: 0.2,
            width: brender.getWidth(),
            height: brender.getHeight()
        });

        brender.urlToImage(window.constructCDNUrl("/content/trading-plaza/overlay.png"))
            .then((image) => {
                overlay.image = image;
            });

        const player = brender.createPlayerEntity({
            id: user.id,
            x: 0,
            y: 0,
            z: 5,
            image: brender.loadingImage,
            width: 300 / 6,
            height: 345 / 6,
            user,
            onFrame: (entity, deltaTime) => {
                renderPlayerText(entity, true);

                let moveX = 0;
                let moveY = 0;

                if (MOVEMENT_KEYS.UP.some((key) => brender.pressing[key])) moveY -= PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.LEFT.some((key) => brender.pressing[key])) moveX -= PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.DOWN.some((key) => brender.pressing[key])) moveY += PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.RIGHT.some((key) => brender.pressing[key])) moveX += PLAYER_SPEED * deltaTime;

                if (moveX !== 0 && moveY !== 0) {
                    moveX *= Math.SQRT1_2;
                    moveY *= Math.SQRT1_2;
                }

                const nextX = entity.x + moveX;
                const nextY = entity.y + moveY;

                if (nextX < -1500 || nextX > 1500) moveX = nextX < -1500 ? -1500 - entity.x : 1500 - entity.x;
                if (nextY < -1500 || nextY > 1500) moveY = nextY < -1500 ? -1500 - entity.y : 1500 - entity.y;

                _previousPos = { x: entity.x, y: entity.y };

                entity.x += Math.floor(moveX);
                entity.y += Math.floor(moveY);

                brender.camera.focusOn(entity);

                overlay.x = brender.camera.x;
                overlay.y = brender.camera.y;
            }
        });

        brender.urlToImage(getUserAvatarPath(user))
            .then((image) => {
                player.image = image;
                player.width = image.width / 6;
                player.height = image.height / 6;
            });

        const movementUpdateInterval = setInterval(() => {
            if (player.x === _previousPos.x && player.y === _previousPos.y) return;

            socket.emit(SocketMessageType.TRADING_PLAZA_MOVE, { x: player.x, y: player.y });
        }, 1000 / 20);

        return () => {
            player.destroy?.();

            socket.emit(SocketMessageType.TRADING_PLAZA_LEAVE);

            socket.off(SocketMessageType.TRADING_PLAZA_JOIN, handleJoin);
            socket.off(SocketMessageType.TRADING_PLAZA_MOVE, handleMove);
            socket.off(SocketMessageType.TRADING_PLAZA_LEAVE, handleLeave);

            socket.off(SocketMessageType.LAGBACK, handleLagback);

            clearInterval(movementUpdateInterval);
        };
    }, [socket]);

    return (
        <div
            className={styles.container}
            onContextMenu={(e) => e.preventDefault()}
        >
            {socket && <BrenderCanvas
                ref={brenderCanvasRef}
                className={styles.canvas}
                debug={true}
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
        </div>
    );
}
