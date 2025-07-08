import { useRef, useEffect } from "react";
import { useResource } from "@stores/ResourceStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";

import { PackProps } from "../market.d";

export default function Pack({ pack, ambienceEnabled = true, onClick }: PackProps) {
    const { resourceIdToPath } = useResource();
    const packRef = useRef<HTMLDivElement>(null);
    const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!pack.ambienceId) return;

        const handleMove = (e: MouseEvent) => {
            if (!packRef.current) return;

            if (!ambienceEnabled && hoverSoundRef.current) {
                hoverSoundRef.current.pause();
                hoverSoundRef.current.currentTime = 0;

                return;
            }

            const rect = packRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 180;
            let volume = 0;
            if (dist < maxDist) {
                volume = 1 - dist / maxDist;
            }

            if (!hoverSoundRef.current) {
                hoverSoundRef.current = new Audio(resourceIdToPath(pack.ambienceId!));

                hoverSoundRef.current.loop = true;
                hoverSoundRef.current.volume = 0;

                hoverSoundRef.current.play().catch(() => { });
            } else if (hoverSoundRef.current.paused) {
                hoverSoundRef.current.play().catch(() => { });
            }

            hoverSoundRef.current.volume = volume * 0.1;
        };

        window.addEventListener("mousemove", handleMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);

            if (hoverSoundRef.current) {
                hoverSoundRef.current.pause();
                hoverSoundRef.current.currentTime = 0;
            }
        };
    }, [pack.ambienceId, ambienceEnabled, resourceIdToPath]);

    return <div ref={packRef} className={styles.packContainer2} onClick={onClick}>
        <ImageOrVideo className={styles.packBackground} src={resourceIdToPath(pack.backgroundId)} />

        <div className={styles.packImageHolder}>
            <ImageOrVideo className={styles.packImage} src={resourceIdToPath(pack.imageId)} />
            <ImageOrVideo className={styles.packShadow} src={resourceIdToPath(pack.imageId)} />
        </div>

        <div className={styles.bottomLeftText}>
            <img src={window.constructCDNUrl("/content/token.png")} alt="Token" />
            {pack.price.toLocaleString()}
        </div>
    </div>;
}
