import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BrenderCanvas, BrenderCanvasRef } from "@brender/index";

import { ParticleType, ParticleCanvasProps, ParticleCanvasRef, ParticleObject } from "./particleCanvas.d";
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
                ParticleType.RIGHT_SHOWER,
                ParticleType.LEFT_SHOWER,
                ParticleType.TOP
            ];
        default:
            return [ParticleType.CENTER];
    }
}

const ParticleCanvas = forwardRef<ParticleCanvasRef, ParticleCanvasProps>(({ width, height, color, animationType, images, particleWidth = 30, particleHeight = 30, particleCount = 200, speed = 2, ...props }, ref) => {
    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastSpawnRef = useRef<number>(0);
    const activeRef = useRef<boolean>(false);

    let id = 0;

    const spawnParticle = async (t: ParticleType, brender: BrenderCanvasRef) => {
        brender.createObject({
            id: `particle-${t}-${id}`,
            x: 99999,
            y: 99999,
            z: 0,
            width: particleWidth,
            height: particleHeight,
            imageTint: color
        });

        id++;
    };

    const setupParticles = async (t: ParticleType, brender: BrenderCanvasRef) => {
        brender.createGenericEntity({
            id: `__particle-emitter-${t}__`,
            x: 0,
            y: 0,
            z: 0,
            onFrame: async (_, deltaTime) => {
                const fakeDeltaTime = deltaTime * speed;

                for (const object of brender.objects.filter((o) => o.id.startsWith(`particle-${t}`)) as ParticleObject[]) {
                    object.vy = (object.vy ?? 0) + (object.gravity ?? 0) * fakeDeltaTime;

                    object.x += (object.vx ?? 0) * fakeDeltaTime;
                    object.y += object.vy * fakeDeltaTime;

                    object.rotation! += (object.angVelocity ?? 0) * fakeDeltaTime;

                    if (object.y > brender.getHeight() || object.y < -50 || object.x < -50 || object.x > brender.getWidth() + 50) {
                        if (!activeRef.current) object.destroy!();

                        const type = particleType(t, brender);
                        const image = await brender.urlToImage(images[Math.floor(Math.random() * images.length)]);

                        const rad = type.angle * Math.PI / 180;
                        const vx = Math.cos(rad) * type.velocity;
                        const vy = Math.sin(rad) * type.velocity;

                        object.x = type.x;
                        object.y = type.y;
                        object.vx = vx;
                        object.vy = vy;
                        object.gravity = type.gravity;
                        object.angVelocity = type.angVelocity;
                        object.rotation = rad;
                        object.image = image;

                        object.width = particleWidth;
                        object.height = particleHeight;
                        object.imageTint = color;
                    }
                }
            }
        });
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

            activeRef.current = true;

            lastSpawnRef.current = performance.now();

            for (const t of animationTypeToParticleType(animationType)!) {
                setupParticles(t, brender);

                (async () => {
                    for (let i = 0; i < particleCount; i++) {
                        if (!activeRef.current) break;

                        spawnParticle(t, brender);

                        await new Promise((r) => setTimeout(r, 10));
                    }
                })();
            }
        },
        stop: () => {
            activeRef.current = false;
        },
        setColor: (newColor: string) => {
            color = newColor;
        },
        setAnimationType: (newAnimationType: RarityAnimationType) => {
            animationType = newAnimationType;
        },
        setImages: (newImages: string[]) => {
            images = newImages;
        },
        setParticleWidth: (width: number) => {
            particleWidth = width;
        },
        setParticleHeight: (height: number) => {
            particleHeight = height;
        },
        setParticleCount: (count: number) => {
            particleCount = count;
        }
    }));

    return (
        <BrenderCanvas
            ref={brenderCanvasRef}
            width={width ?? window.innerWidth}
            height={height ?? window.innerHeight}
            {...props}
        />
    );
});

export default ParticleCanvas;
