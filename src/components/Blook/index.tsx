// since states reset on every render, it makes all the other sparkle animations stop and reset, we have to use refs to keep the state of the sparkles instead
// if anybody knows how to make this use states instead, please make a pull request
// - xotic

import { useEffect, useRef } from "react";
import { ImageOrVideo } from "@components/index";
import styles from "./blook.module.scss";

import { BlookProps } from "./blook.d";

export default function Blook({ custom = false, shiny = false, shinySparkles = true, src, alt, draggable, className, ...props }: BlookProps) {
    const sparkleContainerRef = useRef<HTMLDivElement>(null);

    // this spawns in the corners only
    const generateRandomCoordinates = (width: number, height: number) => {
        const y = Math.random() * height;
        const x = y < 10 || y > height - 10
            ? Math.random() * width
            : Math.random() > 0.5 ? -10 : width - 10;

        return { x, y };
    };

    const createSparkle = (x: number, y: number) => {
        const sparkle = document.createElement("img");
        sparkle.src = window.constructCDNUrl("/content/sparkle.png");
        sparkle.className = styles.sparkle;
        sparkle.style.top = `${y}px`;
        sparkle.style.left = `${x}px`;
        sparkle.draggable = false;

        sparkle.addEventListener("animationend", (e) => (e.currentTarget as HTMLElement).remove());

        return sparkle;
    };

    useEffect(() => {
        if (!shiny || !shinySparkles) return;

        const spawnSparkles = () => {
            // if you're tabbed off for a while there will be a bunch of sparkles that spawn at once
            if (document.hidden) return;

            const sparkles = sparkleContainerRef.current;
            if (!sparkles) return;

            const { width, height } = sparkles.getBoundingClientRect();

            const newSparkle1 = generateRandomCoordinates(width, height);
            const newSparkle2 = generateRandomCoordinates(width, height);

            const sparkle1 = createSparkle(newSparkle1.x, newSparkle1.y);
            const sparkle2 = createSparkle(newSparkle2.x, newSparkle2.y);

            sparkles.appendChild(sparkle1);

            setTimeout(() => sparkles.appendChild(sparkle2), Math.random() * 700 + 700);
        };

        const spawnInterval = setInterval(() => spawnSparkles(), 1700);

        spawnSparkles();

        return () => {
            clearInterval(spawnInterval);
        };
    }, [shiny]);

    return (
        <div
            className={`${className ? `${className} ` : ""}${styles.blook}`}
            {...props}
        >
            {custom && <div className={styles.customIndicatorContainer}>
                <div className={styles.customIndicator}>
                    <span>C</span>
                </div>
            </div>}

            {shiny && <>
                {shinySparkles && <div
                    className={styles.sparkleContainer}
                    ref={sparkleContainerRef}
                />}

                <div
                    style={{ maskImage: `url('${src}')` }}
                    className={styles.overlay}
                />
            </>}

            <ImageOrVideo
                className={styles.image}
                src={src}
                alt={alt}
                draggable={draggable}
            />
        </div>
    );
}
