import { useEffect } from "react";
import styles from "./background.module.scss";

export default function Background({ color, opacity }: { color?: string, opacity?: number }) {
    useEffect(() => {
        document.getElementById("preloader")?.remove();
    }, []);

    return (
        <div className={styles.background} style={{ background: color || "var(--background-color)" }}>
            <div className={styles.backgroundGradient} />
            <div className={styles.backgroundBlooks} style={{
                backgroundImage: `url("${window.constructCDNUrl("/content/background.png")}")`,
                opacity: opacity || "var(--background-opacity)"
            }} />
        </div>
    );
}
