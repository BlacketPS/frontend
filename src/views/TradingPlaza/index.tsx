import { useLayoutEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { BrenderCanvas, BrenderCanvasRef, BrenderEntity, PlayerEntity, urlToImage } from "@brender/index";
import { useUser } from "@stores/UserStore/index";
import { useSocket } from "@stores/SocketStore/index";
import { useData } from "@stores/DataStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { lerp } from "@functions/core/mathematics";
import styles from "./tradingPlaza.module.scss";

import { SocketMessageType } from "@blacket/types";
import { TILES } from "@constants/index";
import map from "./map";

export default function TradingPlaza() {
    const { user, getUserAvatarPath } = useUser();
    const { socket, connected, latency } = useSocket();
    const { fontIdToName } = useData();
    const { addCachedUser } = useCachedUser();

    if (!user) return <Navigate to="/login" />;

    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);

    useLayoutEffect(() => {
        if (!socket) return;

        const brender = brenderCanvasRef.current;
        if (!brender) return;

        const MOVEMENT_KEYS = {
            UP: ["w", "arrowup"],
            LEFT: ["a", "arrowleft"],
            DOWN: ["s", "arrowdown"],
            RIGHT: ["d", "arrowright"],
            RUN: ["shift"]
        };

        const PLAYER_SPEED = 4;
        const TILE_SIZE = 50;
        const COLUMNS = 50;
        const ROWS = 50;

        let _previousPos = { x: 0, y: 0 };

        for (let x = -ROWS; x < ROWS; x++) {
            for (let y = -COLUMNS; y < COLUMNS; y++) {
                const tiles = TILES.filter((tile) => tile.id.includes("grass"));

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
                        width: TILE_SIZE + 1,
                        height: TILE_SIZE + 1,
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

        const renderPlayerText = (entity: PlayerEntity) => {
            const center = entity.x + (entity?.width ?? 300) / 2;

            brender.drawText({
                text: entity.user.username,
                x: center,
                y: entity.y + (entity?.height ?? 345 / 6) + 20,
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
                renderPlayerText(entity);

                let moveX = 0;
                let moveY = 0;

                if (MOVEMENT_KEYS.UP.some((key) => brender.pressing[key])) moveY -= PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.LEFT.some((key) => brender.pressing[key])) moveX -= PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.DOWN.some((key) => brender.pressing[key])) moveY += PLAYER_SPEED * deltaTime;
                if (MOVEMENT_KEYS.RIGHT.some((key) => brender.pressing[key])) moveX += PLAYER_SPEED * deltaTime;

                if (MOVEMENT_KEYS.RUN.some((key) => brender.pressing[key])) {
                    moveX *= 1.5;
                    moveY *= 1.5;
                }

                if (moveX !== 0 && moveY !== 0) {
                    moveX /= Math.SQRT2;
                    moveY /= Math.SQRT2;
                }

                const nextX = (entity.x + moveX) | 0;
                const nextY = (entity.y + moveY) | 0;

                if (nextX < -1500 || nextX > 1500) moveX = nextX < -1500 ? -1500 - entity.x : 1500 - entity.x;
                if (nextY < -1500 || nextY > 1500) moveY = nextY < -1500 ? -1500 - entity.y : 1500 - entity.y;

                _previousPos = { x: entity.x, y: entity.y };

                brender.camera.focusOn(entity as BrenderEntity, 0.05);

                entity.x += moveX | 0;
                entity.y += moveY | 0;

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
