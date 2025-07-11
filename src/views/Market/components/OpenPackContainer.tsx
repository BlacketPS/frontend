import { useEffect, useRef, useState } from "react";
import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";
import { OpenPackContainerProps } from "../market.d";
import { RarityAnimationTypeEnum } from "@blacket/types";

export default function OpenPackContainer({ opening, image, animationType }: OpenPackContainerProps) {
    const [ended, setEnded] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const endImageRef = useRef<HTMLImageElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    const chromaImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const vid = videoRef.current;

        if (vid) if (opening) {
            setEnded(false);

            new Audio(window.constructCDNUrl("/content/audio/sound/pack/pack-tear.mp3")).play();

            vid.currentTime = 0;
            vid.play();
        } else {
            vid.pause();
            vid.currentTime = 0;
        }
    }, [opening]);

    useEffect(() => {
        if (!ended) return;

        const img = endImageRef.current;
        if (!img) return;

        let degrees = 0;
        let left = 0;
        let top = 0;

        let lastTimestamp: number | null = null;
        let totalElapsed = 0;
        let running = true;

        const duration = 500;
        const startSpeed = 1;
        const endSpeed = 0.2;
        const startYSpeed = 0.2;
        const endYSpeed = 2.0;

        const animate = (timestamp: number) => {
            if (!running) return;
            if (lastTimestamp === null) lastTimestamp = timestamp;

            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            totalElapsed += elapsed;

            degrees += elapsed;

            // t for left: linear interpolation (slows down)
            const t = Math.min(totalElapsed / duration, 1);
            const currentSpeed = startSpeed + (endSpeed - startSpeed) * t;

            // tY for top: ease-in (speeds up)
            const tY = Math.min(totalElapsed / duration, 1);
            const currentYSpeed = startYSpeed + (endYSpeed - startYSpeed) * (tY * tY);

            left -= currentSpeed * elapsed;
            top += currentYSpeed * elapsed;

            img.style.transform = `rotate(${degrees}deg)`;
            img.style.left = `${left}px`;
            img.style.top = `${top}px`;
            img.style.position = "absolute";

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            running = false;

            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [ended]);

    useEffect(() => {
        if (!opening) return;
        if (![RarityAnimationTypeEnum.CHROMA, RarityAnimationTypeEnum.MYTHICAL].includes(animationType as RarityAnimationTypeEnum)) return;
        const isMythical = animationType === RarityAnimationTypeEnum.MYTHICAL;

        const img = chromaImageRef.current;
        if (!img) return;

        new Audio(
            isMythical
                ? window.constructCDNUrl("/content/audio/sound/pack/mythical-grow.mp3")
                : window.constructCDNUrl("/content/audio/sound/pack/chroma-grow.mp3")
        ).play();

        let scale = 1;
        let elapsed = 0;
        let last = performance.now();
        let shakePhase = 0;

        // Slow down the grow for more dramatic effect
        const growDuration = isMythical ? 9000 : 5000;
        const maxScale = isMythical ? 4 : 2;
        const shineStart = growDuration - 3000;

        let animationFrameId: number;

        const animate = (time: number) => {
            const dt = time - last;
            last = time;
            elapsed += dt;

            const t = Math.min(elapsed / growDuration, 1);
            scale = 1 + t * (maxScale - 1);

            // Shake: X, Y, and Z (rotation) for a "waving hand" effect
            const shakeX = Math.sin(shakePhase) * 6;
            const shakeY = Math.cos(shakePhase * 1.2) * 6;
            const shakeZ = Math.sin(shakePhase * 0.7);
            shakePhase += isMythical ? 0.05 : 0.12;

            let brightness = 1 + t * 0.3;
            let glow = 0;

            if (isMythical && elapsed > shineStart) {
                const shineT = (elapsed - shineStart) / 2000; // 0 to 1

                brightness += shineT * 3.5;
                glow = brightness * 2;
            }

            img.style.transform =
                `translate(calc(-50% - ${shakeX}px), calc(-50% - ${shakeY}px)) ` +
                `scale(${scale}) ` +
                `rotateZ(${shakeZ}deg)`;

            img.style.transition = "transform 0s";
            img.style.position = "absolute";
            img.style.left = "50%";
            img.style.top = "50%";
            img.style.transformOrigin = "center center";
            img.style.zIndex = "9999";
            img.style.filter = `brightness(${brightness}) drop-shadow(0 0 ${glow}px rgba(255, 255, 255, 1))`;

            if (elapsed < growDuration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                new Audio(window.constructCDNUrl("/content/audio/sound/pack/chroma-explode.mp3")).play();
                if (isMythical) new Audio(window.constructCDNUrl("/content/audio/sound/pack/mythical-explode.mp3")).play();

                img.style.opacity = "0";
                img.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out, filter 0.3s ease-out, border-radius 0.3s ease-out, background-color 0.3s ease-out";
                img.style.transform =
                    `translate(calc(-50% - ${shakeX}px), calc(-50% - ${shakeY}px)) ` +
                    `scale(${scale + (isMythical ? 2 : 1)}) rotateZ(${shakeZ}deg)`;
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [opening, animationType]);

    return (
        <>
            {![
                RarityAnimationTypeEnum.CHROMA,
                RarityAnimationTypeEnum.MYTHICAL
            ].includes(animationType as RarityAnimationTypeEnum) ? <>
                <div className={styles.openPackContainer} data-opening={opening}>
                    {!ended && <video
                        ref={videoRef}
                        className={styles.openPackTop}
                        src={window.constructCDNUrl("/content/pack-top.webm")}
                        controls={false}
                        muted={true}
                        onEnded={setEnded.bind(null, true)}
                    />}
                    <ImageOrVideo className={styles.openPackBottom} src={image} data-opening={opening} />
                </div>

                {ended && <div className={styles.openPackEndContainer}>
                    <img
                        ref={endImageRef}
                        src={window.constructCDNUrl("/content/pack-top-end.png")}
                        className={styles.openPackSeelFall}
                        style={{ left: 0, top: 0 }}
                    />
                </div>}
            </> : <>
                <div className={styles.openPackContainer} style={{ zIndex: 2 }}>
                    <ImageOrVideo
                        ref={chromaImageRef}
                        className={styles.openPackCenter}
                        src={image}
                    />
                </div>
            </>}
        </>
    );
}
