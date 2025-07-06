import { useEffect, useRef, useState } from "react";
import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";
import { OpenPackContainerProps } from "../market.d";

export default function OpenPackContainer({ opening, image }: OpenPackContainerProps) {
    const [ended, setEnded] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const endImageRef = useRef<HTMLImageElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const vid = videoRef.current;

        if (vid) if (opening) {
            setEnded(false);

            new Audio(window.constructCDNUrl("/content/audio/sound/pack-tear.mp3")).play();

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

    return (
        <>
            <div className={styles.openPackContainer} data-opening={opening}>
                {!ended && <video
                    ref={videoRef}
                    className={styles.openPackTop}
                    src={window.constructCDNUrl("/content/test119.webm")}
                    controls={false}
                    muted={true}
                    onEnded={setEnded.bind(null, true)}
                />}
                <ImageOrVideo className={styles.openPackBottom} src={image} data-opening={opening} />
            </div>

            {ended && <div className={styles.openPackEndContainer}>
                <img
                    ref={endImageRef}
                    src={window.constructCDNUrl("/content/test120.png")}
                    className={styles.openPackSeelFall}
                    style={{ left: 0, top: 0 }}
                />
            </div>}
        </>
    );
}
