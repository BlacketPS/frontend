// import { useEffect, useLayoutEffect, useRef } from "react";
// import { ImageOrVideo } from "@components/index";
// import { modifyBlook } from "./modifyBlook.ts";
import styles from "./blook.module.scss";

import { BlookProps } from "./blook.d";

export default function Blook({ custom = false, shiny = false, src, alt, draggable, className, ...props }: BlookProps) {
    // const imageRef = useRef<HTMLImageElement>(null);

    // useEffect(() => {
    //     const load = async () => {
    //         const imageElement = imageRef.current;

    //         if (!imageElement) return;
    //         if (!src) return;
    //         // if (!shiny) return;

    //         imageElement.crossOrigin = "anonymous";

    //         imageElement.onload = async () => {
    //             if (imageElement.dataset.loaded==="true") return;

    //             try {
    //                 const width = imageElement.naturalWidth;
    //                 const height = imageElement.naturalHeight;

    //                 const modifiedImage = await modifyBlook(
    //                     imageElement,
    //                     { width, height },
    //                     {
    //                         static: true
    //                         // grayscale: true
    //                         // inverted: true
    //                     }
    //                 );

    //                 imageElement.src = modifiedImage;
    //                 imageElement.dataset.loaded = "true";
    //             } catch (error) {
    //                 console.error(`Error modifying blook src ${src}:`, error);
    //             }
    //         };

    //         imageElement.src = src;
    //     };

    //     load();
    // }, []);

    return (
        <div style={{
            filter: shiny ? "drop-shadow(0px 0px 2px #fff)" : "none"
        }}>
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
                    <div
                        style={{ maskImage: `url('${src.replaceAll("'", "\\'")}` }}
                        className={styles.overlay}
                    />

                    <div
                        style={{ maskImage: `url('${src.replaceAll("'", "\\'")}` }}
                        className={styles.shimmerOverlay}
                    />
                </>}

                <img
                    // ref={imageRef}
                    className={styles.image}
                    src={src}
                    alt={alt}
                    draggable={draggable}
                />
            </div>
        </div>
    );
}
