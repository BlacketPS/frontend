import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import styles from "../market.module.scss";

import { ParticleType, ParticleCanvasProps, ParticleCanvasRef, ParticleObject } from "../market.d";
import { BrenderCanvas, BrenderCanvasRef } from "@brender/index";
import { RarityAnimationType, RarityAnimationTypeEnum } from "@blacket/types";

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
    return Math.trunc(Math.random() * (max - min)) + min;
}

function particleType(e: ParticleType, brender: BrenderCanvasRef) {
    const velocityDivisor = 100;
    const gravityDivisor = 10000;
    const angVelocityDivisor = 100;

    switch (e) {
        case ParticleType.CENTER: {
            const t = random(-115, -65);

            return {
                x: brender.getWidth() / 2,
                y: brender.getHeight() / 2,
                angle: t,
                velocity: random(600, 750) / velocityDivisor,
                gravity: 700 / gravityDivisor,
                angVelocity: ((t > -90 ? 1 : -1) * random(125, 175)) / angVelocityDivisor
            };
        }
        case ParticleType.RIGHT_BOTTOM: return {
            x: brender.getWidth(),
            y: brender.getHeight(),
            angle: random(-160, -110),
            velocity: random(600, 750) / velocityDivisor,
            gravity: 500 / gravityDivisor,
            angVelocity: random(-175, -125) / angVelocityDivisor
        };
        case ParticleType.LEFT_BOTTOM: return {
            x: 0,
            y: brender.getHeight(),
            angle: random(-70, -20),
            velocity: random(600, 750) / velocityDivisor,
            gravity: 500 / gravityDivisor,
            angVelocity: random(125, 175) / angVelocityDivisor
        };
        case ParticleType.TOP: return {
            x: random(0, brender.getWidth()),
            y: -50,
            angle: 90,
            velocity: random(0, 50) / velocityDivisor,
            gravity: 700 / gravityDivisor,
            angVelocity: random(-150, 150) / angVelocityDivisor
        };
        case ParticleType.RIGHT_SHOWER: return {
            x: brender.getWidth(),
            y: random(0, brender.getHeight()),
            angle: random(-180, -130),
            velocity: random(600, 750) / velocityDivisor,
            gravity: 300 / gravityDivisor,
            angVelocity: random(-175, -125) / angVelocityDivisor
        };
        case ParticleType.LEFT_SHOWER: return {
            x: 0,
            y: random(0, brender.getHeight()),
            angle: random(-50, 0),
            velocity: random(600, 750) / velocityDivisor,
            gravity: 300 / gravityDivisor,
            angVelocity: random(125, 175) / angVelocityDivisor
        };
        case ParticleType.RIGHT_DIAMOND: {
            const a = randomInt(0, brender.getHeight());

            return {
                x: brender.getWidth(),
                y: a,
                angle: a > brender.getHeight() / 2 ? -150 : -210,
                velocity: random(600, 750) / velocityDivisor,
                gravity: 0,
                angVelocity: random(-175, -125) / angVelocityDivisor
            };
        }
        case ParticleType.LEFT_DIAMOND: {
            const n = randomInt(0, brender.getHeight());

            return {
                x: 0,
                y: n,
                angle: n > brender.getHeight() / 2 ? -30 : 30,
                velocity: random(600, 750) / velocityDivisor,
                gravity: 0,
                angVelocity: random(125, 175) / angVelocityDivisor
            };
        }
    }
}

function animationTypeToParticleType(animationType: string) {
    switch (animationType) {
        case RarityAnimationTypeEnum.UNCOMMON:
            return [ParticleType.CENTER];
        case RarityAnimationTypeEnum.RARE:
            return [ParticleType.RIGHT_BOTTOM, ParticleType.LEFT_BOTTOM];
        case RarityAnimationTypeEnum.EPIC:
            return [ParticleType.RIGHT_SHOWER, ParticleType.LEFT_SHOWER];
        case RarityAnimationTypeEnum.LEGENDARY:
            return [ParticleType.TOP];
        case RarityAnimationTypeEnum.CHROMA:
            return [ParticleType.RIGHT_DIAMOND, ParticleType.LEFT_DIAMOND];
        case RarityAnimationTypeEnum.IRIDESCENT:
            return [
                ParticleType.CENTER,
                ParticleType.RIGHT_BOTTOM,
                ParticleType.LEFT_BOTTOM,
                ParticleType.RIGHT_SHOWER,
                ParticleType.LEFT_SHOWER,
                ParticleType.TOP,
                ParticleType.RIGHT_DIAMOND,
                ParticleType.LEFT_DIAMOND
            ];
        default:
            return [ParticleType.CENTER];
    }
}

const ParticleCanvas = forwardRef<ParticleCanvasRef, ParticleCanvasProps>(({ color, animationType }, ref) => {
    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastSpawnRef = useRef<number>(0);

    const images = [
        window.constructCDNUrl("/content/particles/1.png"),
        window.constructCDNUrl("/content/particles/2.png"),
        window.constructCDNUrl("/content/particles/3.png"),
        window.constructCDNUrl("/content/particles/4.png"),
        window.constructCDNUrl("/content/particles/5.png"),
        window.constructCDNUrl("/content/particles/6.png"),
        window.constructCDNUrl("/content/particles/7.png"),
        window.constructCDNUrl("/content/particles/8.png")
    ];

    let id = 0;

    let hue = 0,
        hueDirection = 1;
    let lightness = 1,
        lightnessDirection = -1;

    const spawnParticle = async (t: ParticleType, brender: BrenderCanvasRef) => {
        const type = particleType(t, brender);
        const image = await brender.urlToImage(images[Math.floor(Math.random() * images.length)]);

        id++;

        const rad = type.angle * Math.PI / 180;
        const vx = Math.cos(rad) * type.velocity;
        const vy = Math.sin(rad) * type.velocity;

        return brender.createObject({
            id: id.toString(),
            x: type.x,
            y: type.y,
            z: 0,
            vx,
            vy,
            gravity: type.gravity,
            angVelocity: type.angVelocity,
            width: 30,
            height: 30,
            rotation: rad,
            image,
            imageTint: color,
            onFrame: (object: ParticleObject, deltaTime) => {
                const fakeDeltaTime = deltaTime * 2;

                object.vy = (object.vy ?? 0) + (object.gravity ?? 0) * fakeDeltaTime;

                object.x += (object.vx ?? 0) * fakeDeltaTime;
                object.y += object.vy * fakeDeltaTime;

                object.rotation! += (object.angVelocity ?? 0) * fakeDeltaTime;

                if (object.y > brender.getHeight() || object.y < -50 || object.x < -50 || object.x > brender.getWidth() + 50) {
                    object.destroy!();
                }
            }
        } as ParticleObject);
    };

    useEffect(() => {
        const brender = brenderCanvasRef.current;
        if (!brender) return;

        brender.camera.moveTo(0, 0);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);

                animationFrameRef.current = null;
            }
        };
    }, []);

    useImperativeHandle(ref, () => ({
        start: () => {
            const brender = brenderCanvasRef.current;
            if (!brender) return;

            lastSpawnRef.current = performance.now();

            const spawnLoop = async (now: number) => {
                const brender = brenderCanvasRef.current;
                if (!brender) return;

                if (now - lastSpawnRef.current >= 10) {
                    for (const t of animationTypeToParticleType(animationType)!) await spawnParticle(t, brender);

                    lastSpawnRef.current = now;
                }

                animationFrameRef.current = requestAnimationFrame(spawnLoop);
            };

            animationFrameRef.current = requestAnimationFrame(spawnLoop);
        },
        stop: () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        },
        setColor: (newColor: string) => {
            color = newColor;
        },
        setAnimationType: (newAnimationType: RarityAnimationType) => {
            animationType = newAnimationType;
        }
    }));

    return (
        <BrenderCanvas
            ref={brenderCanvasRef}
            className={styles.canvas}
            debug={true}
            showFPS={true}
        />
    );
});

export default ParticleCanvas;
