// TODO: implement this after rewrite is finished

import { useLayoutEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { BrenderCanvas, BrenderCanvasRef, BrenderObject } from "@brender/index";
import { useUser } from "@stores/UserStore/index";
import { Button } from "@components/index";
import styles from "./mapEditor.module.scss";

import { Mode } from "./mapEditor.d";

export default function MapEditor() {
    // return <Navigate to="/dashboard" />;

    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    const BRENDER_CANVAS_REF = useRef<BrenderCanvasRef>(null);

    const CAMERA_SPEED = 10;
    const MOVEMENT_KEYS = {
        UP: ["w", "arrowup"],
        LEFT: ["a", "arrowleft"],
        DOWN: ["s", "arrowdown"],
        RIGHT: ["d", "arrowright"]
    };

    const TILES = [
        { id: "grass-1", width: 50, height: 50, url: window.constructCDNUrl("/content/trading-plaza/grass-1.png") },
        { id: "grass-2", width: 50, height: 50, url: window.constructCDNUrl("/content/trading-plaza/grass-2.png") },
        { id: "grass-3", width: 50, height: 50, url: window.constructCDNUrl("/content/trading-plaza/grass-3.png") },
        { id: "grass-4", width: 50, height: 50, url: window.constructCDNUrl("/content/trading-plaza/grass-4.png") },
        { id: "grass-5", width: 50, height: 50, url: window.constructCDNUrl("/content/trading-plaza/grass-5.png") },
        { id: "grass-6", width: 50, height: 50, url: window.constructCDNUrl("/content/trading-plaza/grass-6.png") },
        { id: "spawn", width: 1000, height: 1000, url: window.constructCDNUrl("/content/trading-plaza/spawn.png") },
        { id: "spawn-ring", width: 1600, height: 1600, url: window.constructCDNUrl("/content/trading-plaza/spawn-ring.png") }
    ];

    let mode: Mode = Mode.EDIT;

    let tileSelected: BrenderObject | null = null;
    let objectSelected: BrenderObject | null = null;

    let isMouseDown = false;

    useLayoutEffect(() => {
        const brender = BRENDER_CANVAS_REF.current;
        if (!brender) return;

        const scrollHandler = (event: WheelEvent) => brender.camera.zoom(-event.deltaY / 1000);

        const mouseDownHandler = () => isMouseDown = true;
        const mouseUpHandler = () => isMouseDown = false;

        const placeTile = (entity: BrenderObject) => {
            if (!tileSelected) return;

            if (brender.objects.some((obj) => obj.x === entity.x && obj.y === entity.y)) return;

            brender.createObject({
                id: `${tileSelected.id} ${entity.x} ${entity.y}`,
                x: entity.x,
                y: entity.y,
                z: 1,
                width: tileSelected.width,
                height: tileSelected.height,
                image: tileSelected.image
            });
        };

        brender.createGenericEntity({
            id: "frame",
            x: 0,
            y: 0,
            z: 0,
            onFrame: (_, deltaTime) => {
                const speed = (CAMERA_SPEED / brender.camera.scale) * deltaTime;

                if (MOVEMENT_KEYS.UP.some((key) => brender.pressing[key])) brender.camera.moveBy(0, -speed);
                if (MOVEMENT_KEYS.LEFT.some((key) => brender.pressing[key])) brender.camera.moveBy(-speed, 0);
                if (MOVEMENT_KEYS.DOWN.some((key) => brender.pressing[key])) brender.camera.moveBy(0, speed);
                if (MOVEMENT_KEYS.RIGHT.some((key) => brender.pressing[key])) brender.camera.moveBy(speed, 0);

                const objectUnderMouse = brender.objects.find((obj) => brender.isMouseOver(obj));
                if (objectUnderMouse && mode !== Mode.CREATE) {
                    switch (mode) {
                        case Mode.EDIT:
                            if (isMouseDown) objectSelected = objectUnderMouse;

                            break;
                        case Mode.DELETE:
                            if (isMouseDown) objectUnderMouse.destroy?.();

                            break;
                    }

                    // brender.drawRect(objectUnderMouse.x, objectUnderMouse.y, objectUnderMouse?.image?.width ?? 0, objectUnderMouse?.image?.height ?? 0, "rgba(255, 255, 255, 0.2)");
                    brender.drawRect({
                        x: objectUnderMouse.x,
                        y: objectUnderMouse.y,
                        width: objectUnderMouse?.image?.width ?? 0,
                        height: objectUnderMouse?.image?.height ?? 0,
                        color: "rgba(255, 255, 255, 0.2)"
                    });
                }

                if (objectSelected) {
                    const x = brender.getWidth() - 10;

                    // brender.renderText(objectSelected.id, x, 20, { textAlign: "right" }, false);
                    // brender.renderText(`X: ${objectSelected.x}`, x, 40, { textAlign: "right" }, false);
                    // brender.renderText(`Y: ${objectSelected.y}`, x, 60, { textAlign: "right" }, false);
                    // brender.renderText(`Z: ${objectSelected.z}`, x, 80, { textAlign: "right" }, false);
                    // brender.renderText(`W: ${objectSelected.width ?? objectSelected?.image?.width ?? 0}`, x, 100, { textAlign: "right" }, false);
                    // brender.renderText(`H: ${objectSelected.height ?? objectSelected?.image?.height ?? 0}`, x, 120, { textAlign: "right" }, false);
                    brender.drawText({
                        text: objectSelected.id,
                        x,
                        y: 20,
                        style: { textAlign: "right" },
                        useCamera: false
                    });
                    brender.drawText({
                        text: `X: ${objectSelected.x}`,
                        x,
                        y: 40,
                        style: { textAlign: "right" },
                        useCamera: false
                    });
                    brender.drawText({
                        text: `Y: ${objectSelected.y}`,
                        x,
                        y: 60,
                        style: { textAlign: "right" },
                        useCamera: false
                    });
                    brender.drawText({
                        text: `Z: ${objectSelected.z}`,
                        x,
                        y: 80,
                        style: { textAlign: "right" },
                        useCamera: false
                    });
                    brender.drawText({
                        text: `W: ${objectSelected.width ?? objectSelected?.image?.width ?? 0}`,
                        x,
                        y: 100,
                        style: { textAlign: "right" },
                        useCamera: false
                    });
                    brender.drawText({
                        text: `H: ${objectSelected.height ?? objectSelected?.image?.height ?? 0}`,
                        x,
                        y: 120,
                        style: { textAlign: "right" },
                        useCamera: false
                    });
                }
            }
        });

        brender.createGenericEntity({
            id: "selected-tile",
            x: 0,
            y: 0,
            z: 0,
            onFrame: (entity) => {
                if (tileSelected && mode === Mode.CREATE) {
                    const tileWidth = tileSelected.image?.width ?? 0;
                    const tileHeight = tileSelected.image?.height ?? 0;

                    const snappedX = Math.floor(brender.mousePosition.x / (tileWidth / 2)) * (tileWidth / 2);
                    const snappedY = Math.floor(brender.mousePosition.y / (tileHeight / 2)) * (tileHeight / 2);

                    entity.x = snappedX - tileWidth / 2;
                    entity.y = snappedY - tileHeight / 2;

                    entity.image = tileSelected.image;

                    // brender.renderText(`${entity.x}, ${entity.y}`, entity.x + tileWidth / 2, entity.y + tileHeight + 30, { fontSize: 25, textAlign: "center" });
                    brender.drawText({
                        text: `${entity.x}, ${entity.y}`,
                        x: entity.x + tileWidth / 2,
                        y: entity.y + tileHeight + 30,
                        style: { fontSize: 25, textAlign: "center" },
                        useCamera: true
                    });

                    if (isMouseDown) {
                        placeTile(entity);
                    }
                } else {
                    entity.image = undefined;
                }
            }
        });

        document.addEventListener("wheel", scrollHandler);
        document.addEventListener("mousedown", mouseDownHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        return () => {
            document.removeEventListener("wheel", scrollHandler);
            document.removeEventListener("mousedown", mouseDownHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [BRENDER_CANVAS_REF]);

    const setSelectedTile = (name: string, width: number, height: number, url: string) => {
        const brender = BRENDER_CANVAS_REF.current;
        if (!brender) return;

        brender.urlToImage(url)
            .then((image) => {
                image.width = width;
                image.height = height;

                tileSelected = {
                    id: name,
                    x: 0,
                    y: 0,
                    z: 0,
                    width,
                    height,
                    image
                };
            });
    };

    return (
        <>
            <div className={styles.container}>
                <BrenderCanvas
                    className={styles.canvas}
                    ref={BRENDER_CANVAS_REF}
                    debug={true}
                />
            </div>

            <div className={styles.bottomContainer}>
                <div className={styles.left}>
                    <Button.GenericButton
                        icon="fas fa-pencil-alt"
                        onClick={() => mode = Mode.EDIT}
                    />
                    <Button.GenericButton
                        icon="fas fa-trash"
                        onClick={() => mode = Mode.DELETE}
                    />
                </div>

                <div className={styles.middle}>
                    {TILES.map((tile, index) => (
                        <div key={index} className={styles.tileContainer} onClick={() => {
                            setSelectedTile(tile.id, tile.width, tile.height, tile.url);

                            mode = Mode.CREATE;
                        }}>
                            <img src={tile.url} alt={tile.id} />
                        </div>
                    ))}
                </div>

                <div className={styles.right}>
                    <Button.ClearButton>Import</Button.ClearButton>
                    <Button.ClearButton>Export</Button.ClearButton>
                </div>
            </div>
        </>
    );
}
