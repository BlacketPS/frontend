import { useRef, useEffect } from "react";
import { gainToDb } from "tone";
import { useResource } from "@stores/ResourceStore/index";
import { useSound } from "@stores/SoundStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";

import { PackProps } from "../market.d";

export default function Pack({ pack, ambienceEnabled = true, onClick }: PackProps) {
    const { resourceIdToPath } = useResource();
    const { defineSounds, getSound, playSound, stopSound } = useSound();

    const packRef = useRef<HTMLDivElement>(null);
    const ambienceIdRef = useRef<string>(`pack-ambience-${pack.id}`);

    useEffect(() => {
        const handleMove = async (e: MouseEvent) => {
            if (!packRef.current) return;
            if (!ambienceEnabled || !pack.ambienceId) return;

            const rect = packRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let volume = 0;
            if (dist < 180) volume = 1 - dist / 180;
            else volume = 0;

            if (!ambienceEnabled || !pack.ambienceId) return;

            const sound = await getSound(ambienceIdRef.current);
            if (sound) {
                if (sound.state === "stopped") await playSound(ambienceIdRef.current);

                sound.volume.value = gainToDb(volume * 0.1);
            }
        };

        window.addEventListener("mousemove", handleMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
        };
    }, [pack.ambienceId, ambienceEnabled, resourceIdToPath, defineSounds, getSound, playSound, stopSound]);

    return (
        <div ref={packRef} className={styles.packContainer2} onClick={onClick}>
            <ImageOrVideo className={styles.packBackground} src={resourceIdToPath(pack.backgroundId)} />

            <div className={styles.packImageHolder}>
                <ImageOrVideo className={styles.packImage} src={resourceIdToPath(pack.imageId)} />
                <ImageOrVideo className={styles.packShadow} src={resourceIdToPath(pack.imageId)} />
            </div>

            <div className={styles.bottomLeftText}>
                <img src={window.constructCDNUrl("/content/token.png")} alt="Token" />
                {pack.price.toLocaleString()}
            </div>
        </div>
    );
}
