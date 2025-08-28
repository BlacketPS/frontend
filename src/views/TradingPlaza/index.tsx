import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

// TODO: Put these somewhere else
type RGBA = { r: number; g: number; b: number; a: number };

const TIME_KEYFRAMES: Array<{ minute: number; color: RGBA }> = [
    { minute: 0, color: { r: 6, g: 10, b: 22, a: 0.7 } }, // 00:00 midnight - almost black-blue
    { minute: 300, color: { r: 10, g: 15, b: 30, a: 0.6 } }, // 05:00 pre-dawn
    { minute: 360, color: { r: 255, g: 150, b: 70, a: 0.2 } }, // 06:00 sunrise (strong warm glow)
    { minute: 600, color: { r: 120, g: 190, b: 255, a: 0.2 } }, // 10:00 morning
    { minute: 780, color: { r: 0, g: 0, b: 0, a: 0 } }, // 13:00 midday
    { minute: 1020, color: { r: 255, g: 160, b: 80, a: 0.2 } }, // 17:00 golden hour
    { minute: 1140, color: { r: 110, g: 40, b: 120, a: 0.3 } }, // 19:00 dusk, more saturated purple
    { minute: 1220, color: { r: 6, g: 10, b: 22, a: 0.7 } }  // 20:00 midnight again
];

const MOVEMENT_KEYS = {
    UP: ["w", "arrowup"],
    LEFT: ["a", "arrowleft"],
    DOWN: ["s", "arrowdown"],
    RIGHT: ["d", "arrowright"],
    RUN: ["shift"]
};

const clampBit = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const minutesSinceMidnightLocal = (): number => {
    const now = new Date();

    return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
};
const minuteToHHMM = (m: number) => {
    const hh = Math.floor(m / 60) % 24;
    const mm = Math.floor(m % 60);
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const lerpRGBA = (a: RGBA, b: RGBA, t: number): RGBA => {
    return {
        r: Math.round(lerp(a.r, b.r, t)),
        g: Math.round(lerp(a.g, b.g, t)),
        b: Math.round(lerp(a.b, b.b, t)),
        a: lerp(a.a, b.a, t)
    };
};

const getTimeColor = (m: number): RGBA => {
    const f = TIME_KEYFRAMES, n = f.length;
    let i = f.findIndex((k) => m <= k.minute);
    if (i === -1) i = n;
    const a = i === 0 ? f[n - 1] : f[i - 1];
    const b = i === n ? f[0] : f[i];

    const bMin = b.minute + (i === n ? 1440 : 0);
    const span = bMin - a.minute || 1;
    const t = clampBit(((m + (i === 0 ? 1440 : 0)) - a.minute) / span);

    return lerpRGBA(a.color, b.color, t);
};

export default function TradingPlaza() {
    const { user, getUserAvatarPath } = useUser();
    const { socket, connected, latency } = useSocket();
    const { fontIdToName } = useData();
    const { addCachedUser } = useCachedUser();
    const { playSound, defineSounds, stopSound, setVolume } = useSound();

    if (!user) return <Navigate to="/login" />;

    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);
    const waterBackgroundRef = useRef<HTMLDivElement>(null);

    const [useSystemTime, setUseSystemTime] = useState<boolean>(true);
    const [debugMinute, setDebugMinute] = useState<number>(() => Math.floor(minutesSinceMidnightLocal()));
    const overlayRef = useRef<RGBA>(getTimeColor(debugMinute));

    const stepSounds = [
        "step-1",
        "step-2",
        "step-3",
        "step-4",
        "step-5"
    ];

    const setAmbienceVolumes = (minute: number) => {
        let mix = 0;

        if (minute >= 1140 || minute < 360) mix = 1;
        else if (minute >= 1080 && minute < 1140) mix = (minute - 1080) / 60;
        else if (minute >= 360 && minute < 420) mix = 1 - (minute - 360) / 60;
        else mix = 0;

        const dayGain = 0.5 * (1 - mix);
        const nightGain = 0.5 * mix;

        setVolume("trading-plaza-ambience", dayGain > 0 ? gainToDb(dayGain) : gainToDb(0));
        setVolume("trading-plaza-night-ambience", nightGain > 0 ? gainToDb(nightGain) : gainToDb(0));
    };

    useEffect(() => {
        defineSounds([
            {
                id: "trading-plaza-ambience",
                url: window.constructCDNUrl("/content/audio/sound/trading-plaza/ambience.mp3"),
                options: {
                    loop: true,
                    preload: true,
                    volume: gainToDb(0)
                }
            },
            {
                id: "trading-plaza-night-ambience",
                url: window.constructCDNUrl("/content/audio/sound/trading-plaza/night-ambience.mp3"),
                options: {
                    loop: true,
                    preload: true,
                    volume: gainToDb(0)
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
                playSound("trading-plaza-night-ambience");

                setAmbienceVolumes(debugMinute);
            });

        return () => {
            stopSound("trading-plaza-ambience");
            stopSound("trading-plaza-night-ambience");
        };
    }, [defineSounds, playSound]);

    useEffect(() => {
        overlayRef.current = getTimeColor(debugMinute);

        setAmbienceVolumes(debugMinute);
    }, [debugMinute]);

    useEffect(() => {
        if (useSystemTime) {
            const m = Math.floor(minutesSinceMidnightLocal());

            setDebugMinute(m);

            overlayRef.current = getTimeColor(m);
        }
    }, [useSystemTime]);

    useLayoutEffect(() => {
        if (!socket) return;

        const brender = brenderCanvasRef.current;
        if (!brender) return;

        let active = true;

        const PLAYER_SPEED = (window.innerWidth < 1024 ? 8 : 10);
        const FOOTSTEP_INTERVAL = 350 / (PLAYER_SPEED / 10);

        // TODO: delete this
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

            brender.createGenericEntity({
                id: "time-cycle",
                x: 0,
                y: 0,
                z: Number.MAX_SAFE_INTEGER,
                onFrame: async () => {
                    const TIME_OVERLAY = overlayRef.current;
                    const alpha = clampBit(TIME_OVERLAY.a);

                    brender.drawRect({
                        x: 0,
                        y: 0,
                        z: Number.MAX_SAFE_INTEGER,
                        width: brender.getWidth(),
                        height: brender.getHeight(),
                        color: `rgba(${TIME_OVERLAY.r}, ${TIME_OVERLAY.g}, ${TIME_OVERLAY.b}, ${alpha})`
                    });
                }
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

            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: 10,
                    zIndex: 10,
                    background: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(4px)",
                    borderRadius: 8,
                    color: "#fff",
                    width: 260
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <input
                        id="useSystemTime"
                        type="checkbox"
                        checked={useSystemTime}
                        onChange={(e) => setUseSystemTime(e.target.checked)}
                    />
                    <label htmlFor="useSystemTime">system time (snapshot at open)</label>
                </div>

                <div style={{ opacity: useSystemTime ? 0.5 : 1, pointerEvents: useSystemTime ? "none" : "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span>fake time</span>
                        <span>{minuteToHHMM(debugMinute)}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1439}
                        value={debugMinute}
                        onChange={(e) => setDebugMinute(Number(e.target.value))}
                        style={{ width: "100%" }}
                    />
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
