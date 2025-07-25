import { ImageOrVideo } from "@components/index";
import styles from "./blook.module.scss";

import { BlookProps } from "./blook.d";

export default function Blook({ custom = false, shiny = false, big = false, src, alt, draggable, className, ...props }: BlookProps) {
    return (
        <>
            <div
                className={`${className ? `${className} ` : ""}${styles.blook}`}
                style={{
                    filter: shiny ? "drop-shadow(0px 0px 2px #fff)" : undefined,
                    transform: big ? "scale(1.4)" : undefined,
                    margin: big ? "15px" : undefined,
                    ...props.style
                }}
                {...props}
            >
                {custom && <div className={styles.customIndicatorContainer}>
                    <div className={styles.customIndicator}>
                        <span>C</span>
                    </div>
                </div>}

                {shiny && <>
                    <div
                        style={{ maskImage: `url('${src.replaceAll("'", "\\'")}` }}
                        className={styles.overlay}
                    />

                    <div
                        style={{ maskImage: `url('${src.replaceAll("'", "\\'")}` }}
                        className={styles.shimmerOverlay}
                    />
                </>}

                <ImageOrVideo
                    className={styles.image}
                    src={src}
                    alt={alt}
                    draggable={draggable}
                />
            </div>
        </>
    );
}
