import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useSocket } from "@stores/SocketStore/index";
import { useData } from "@stores/DataStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import styles from "./tradingPlaza.module.scss";

import { Entity, EntityType, PlayerEntity, Tile } from "./tradingPlaza.d";
import { SocketMessageType } from "blacket-types";

export default function TradingPlaza() {
    const navigate = useNavigate();

    const { user, getUserAvatarPath } = useUser();
    const { socket, latency } = useSocket();
    const { fonts } = useData();
    const { addCachedUser } = useCachedUser();

    if (!user) return navigate("/login");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const tiles: Tile[] = [
        { id: "grass-1", image: window.constructCDNUrl("/content/grass-1.png"), chance: 0.1 },
        { id: "grass-2", image: window.constructCDNUrl("/content/grass-2.png"), chance: 0.003 },
        { id: "grass-3", image: window.constructCDNUrl("/content/grass-3.png"), chance: 0.005, flippable: true },
        { id: "grass-4", image: window.constructCDNUrl("/content/grass-4.png"), chance: 0.005, flippable: true },
        { id: "grass-5", image: window.constructCDNUrl("/content/grass-5.png"), chance: 0.001 },
        { id: "grass-6", image: window.constructCDNUrl("/content/grass-6.png"), chance: 0.0025, flippable: true }
    ];

    const entities: Entity[] = [
        { id: "spawn", type: EntityType.SPAWN, x: 1500, y: 1500, image: window.constructCDNUrl("/content/spawn.png") }
    ];

    const images = new Map<string, HTMLImageElement>();

    tiles.forEach((tile) => {
        const img = new Image();
        img.src = tile.image;
        images.set(tile.id, img);
    });

    const playerImage = new Image();
    playerImage.src = getUserAvatarPath(user);

    useLayoutEffect(() => {
        if (!socket) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const tileSize = window.innerWidth < 768 ? 75 : 50;

        const viewportWidth = canvas.clientWidth;
        const viewportHeight = canvas.clientHeight;

        canvas.width = viewportWidth;
        canvas.height = viewportHeight;

        const cols = 200;
        const rows = 200;

        const tileMap: any[] = [];

        for (let x = 0; x < rows; x++) {
            tileMap.push([]);

            for (let y = 0; y < cols; y++) {
                let key: string = "";
                let tile: Tile = tiles[0];

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

                tileMap[tileMap.length - 1].push({
                    key,
                    flipped: tile.flippable && Math.random() < 0.5
                });
            }
        }

        socket.emit(SocketMessageType.TRADING_PLAZA_JOIN);

        const addUserEntity = async (userId: string) => {
            const alreadyExists = entities.find((entity) => entity.id === userId);
            if (alreadyExists) return;

            const user = await addCachedUser(userId);

            (entities as PlayerEntity[]).push({
                id: userId,
                type: EntityType.PLAYER,
                x: 1500 / tileSize,
                y: 1500 / tileSize,
                targetX: 1500 / tileSize,
                targetY: 1500 / tileSize,
                image: getUserAvatarPath(user),
                user
            });
        };

        const handleJoin = async (data: { userId: string }) => addUserEntity(data.userId);
        const handleMove = async (data: { userId: string, x: number, y: number }) => {
            if (data.userId === user.id) return;

            const entity = entities.find((entity) => entity.id === data.userId) as PlayerEntity;
            if (!entity) return addUserEntity(data.userId);

            entity.targetX = data.x / tileSize;
            entity.targetY = data.y / tileSize;
        };
        const handleLeave = (data: { userId: string }) => {
            const index = entities.findIndex((entity) => entity.id === data.userId);
            if (index !== -1) entities.splice(index, 1);
        };

        socket.on(SocketMessageType.TRADING_PLAZA_JOIN, handleJoin);
        socket.on(SocketMessageType.TRADING_PLAZA_MOVE, handleMove);
        socket.on(SocketMessageType.TRADING_PLAZA_LEAVE, handleLeave);

        const player = {
            x: 1500,
            y: 1500
        };

        const playerSpeed = 5;
        const keysPressed: { [key: string]: boolean } = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed[e.key] = false;
        };

        const lerp = (start: number, end: number, t: number) => {
            return start + (end - start) * t;
        };

        let lastTime = 0;
        let _previousPos = { x: player.x, y: player.y };

        const updatePlayerPosition = (deltaTime: number) => {
            const speed = 0.24;

            for (const entity of entities.filter((entity): entity is PlayerEntity => entity.type === EntityType.PLAYER)) {
                entity.x = lerp(entity.x, entity.targetX, speed);
                entity.y = lerp(entity.y, entity.targetY, speed);
            }

            _previousPos = { x: player.x, y: player.y };

            let moveX = 0;
            let moveY = 0;

            if (keysPressed["w"] || keysPressed["W"]) moveY -= playerSpeed * deltaTime;
            if (keysPressed["a"] || keysPressed["A"]) moveX -= playerSpeed * deltaTime;
            if (keysPressed["s"] || keysPressed["S"]) moveY += playerSpeed * deltaTime;
            if (keysPressed["d"] || keysPressed["D"]) moveX += playerSpeed * deltaTime;

            if (moveX !== 0 && moveY !== 0) {
                moveX *= Math.SQRT1_2;
                moveY *= Math.SQRT1_2;
            }

            const nextX = player.x + moveX;
            const nextY = player.y + moveY;

            if (nextX < 0 || nextX > 3000) moveX = 0;
            if (nextY < 0 || nextY > 3000) moveY = 0;

            player.x += Math.floor(moveX);
            player.y += Math.floor(moveY);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        let animationFrameId: number;

        const frame = (time: number) => {
            const deltaTime = (time - lastTime) / 8.33;
            lastTime = time;

            updatePlayerPosition(deltaTime);

            ctx.clearRect(0, 0, viewportWidth, viewportHeight);

            // TILEMAP
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const obj = tileMap[row][col].key;
                    const img = images.get(obj);

                    if (!img) continue;

                    const x = Math.floor(col * tileSize - player.x);
                    const y = Math.floor(row * tileSize - player.y);

                    if (!(x + tileSize > -tileSize && x < viewportWidth + tileSize && y + tileSize > -tileSize && y < viewportHeight + tileSize)) continue;

                    ctx.save();

                    if (tileMap[row][col].flipped) {
                        ctx.scale(-1, 1);
                        ctx.drawImage(img, -x - tileSize, y, tileSize, tileSize);
                    } else {
                        ctx.drawImage(img, x, y, tileSize, tileSize);
                    }

                    ctx.restore();
                }
            }

            for (const entity of entities) {
                const x = entity.x * tileSize - player.x + (viewportWidth / 2 - tileSize / 2);
                const y = entity.y * tileSize - player.y + (viewportHeight / 2 - tileSize / 2);

                if (!(x + tileSize > -tileSize && x < viewportWidth + tileSize && y + tileSize > -tileSize && y < viewportHeight + tileSize)) continue;

                switch (entity.type) {
                    case EntityType.PLAYER:
                        const playerEntity = entity as PlayerEntity;

                        const img = new Image();
                        img.src = entity.image;

                        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;

                        ctx.drawImage(img, x, y, img.width / 6, img.height / 6);

                        ctx.font = `20px ${fonts.find((font) => font.id === playerEntity.user.fontId)?.name}`;
                        ctx.fillStyle = playerEntity.user.color;
                        ctx.textAlign = "center";
                        ctx.fillText(playerEntity.user.username, x + 25, y + 80);

                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;

                        break;
                }
            }

            const playerX = viewportWidth / 2 - tileSize / 2;
            const playerY = viewportHeight / 2 - tileSize / 2;

            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            ctx.drawImage(playerImage, playerX, playerY, playerImage.width / 6, playerImage.height / 6);

            ctx.font = `20px ${fonts.find((font) => font.id === user.fontId)?.name}`;
            ctx.fillStyle = user.color;
            ctx.textAlign = "center";
            ctx.fillText(user.username, playerX + 25, playerY + 80);
            ctx.fillText(player.x + ", " + player.y, playerX + 25, playerY + 105);

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            animationFrameId = window.requestAnimationFrame(frame);
        };

        animationFrameId = window.requestAnimationFrame(frame);

        const movementUpdateInterval = setInterval(() => {
            if (player.x === _previousPos.x && player.y === _previousPos.y) return;

            socket.emit(SocketMessageType.TRADING_PLAZA_MOVE, { x: player.x, y: player.y });
        }, 1000 / 24);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, viewportWidth, viewportHeight);
            clearInterval(movementUpdateInterval);

            socket.emit(SocketMessageType.TRADING_PLAZA_LEAVE);

            socket.off(SocketMessageType.TRADING_PLAZA_JOIN, handleJoin);
            socket.off(SocketMessageType.TRADING_PLAZA_MOVE, handleMove);
            socket.off(SocketMessageType.TRADING_PLAZA_LEAVE, handleLeave);
        };
    }, [socket]);

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.ui}>
                <div
                    className={styles.latency}
                    style={{
                        color: latency < 100 ? "unset" : latency < 200 ? "yellow" : "red"
                    }}
                >
                    Latency: {latency}ms
                </div>
            </div>
        </div>
    );
}
