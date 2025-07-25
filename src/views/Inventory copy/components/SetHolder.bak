import { useEffect, useRef } from "react";
import { BrenderCanvas, BrenderCanvasRef } from "@brender/index";
import styles from "../inventory.module.scss";

import { SetHolderProps, TiledBackgroundProps } from "../inventory";

const TILE_SIZE = 25;
const GAP = 5;
const OFFSET = TILE_SIZE / 2 + GAP / 2;

function TiledBackground({ icon }: TiledBackgroundProps) {
    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);

    useEffect(() => {
        const brenderCanvas = brenderCanvasRef.current;
        if (!brenderCanvas) return;

        const image = new Image();
        image.src = icon;

        image.onload = () => {
            const canvasWidth = brenderCanvas.getWidth();
            const canvasHeight = brenderCanvas.getHeight();

            for (let y = 0; y < canvasHeight; y += TILE_SIZE + GAP) {
                for (let x = 0; x < canvasWidth; x += TILE_SIZE + GAP) {
                    // determine the offset for staggered rows
                    const xOffset = (y / (TILE_SIZE + GAP)) % 2 === 0 ? 0 : OFFSET;

                    brenderCanvas.createObject({
                        id: `${x}-${y}`,
                        x: x + xOffset,
                        y: y - 1,
                        z: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        image
                    });
                }
            }
        };
    }, [brenderCanvasRef, icon]);

    return (
        <BrenderCanvas
            ref={brenderCanvasRef}
            className={styles.setTopCanvas}
        />
    );
}

export default function SetHolder({ name, icon, nothing, children }: SetHolderProps) {
    const setTopBackgroundRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.setHolder}>
            <div className={styles.setTop}>
                <div className={styles.setTopBackground} ref={setTopBackgroundRef}>
                    {icon && <TiledBackground icon={icon} />}
                </div>
                <div className={styles.setTopText}>{name}</div>
                <div className={styles.setTopDivider} />
            </div>
            <div className={styles.setItems} data-nothing={nothing}>
                {children}
            </div>
        </div>
    );
}