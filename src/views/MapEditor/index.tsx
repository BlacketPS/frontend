import { useLayoutEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { BrenderCanvas, BrenderCanvasRef, BrenderObject } from "@brender/index";
import { useUser } from "@stores/UserStore/index";
import * as Component from "./components/index";
import styles from "./mapEditor.module.scss";

import { Mode, TileSet } from "./mapEditor.d";
import { TILES } from "@constants/index";

export default function MapEditor() {
    // return <Navigate to="/dashboard" />;

    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    const BRENDER_CANVAS_REF = useRef<BrenderCanvasRef>(null);

    let mode: Mode = Mode.EDIT;

    let tileSelected: BrenderObject | null = null;
    let objectSelected: BrenderObject | null = null;

    let isMouseDown = false;
    let isRightMouseDown = false;
    let lastMousePosition = { x: 0, y: 0 };

    const exportMap = () => {
        const brender = BRENDER_CANVAS_REF.current;
        if (!brender) return;

        const tileSets: TileSet[] = [];

        for (const obj of brender.objects) {
            tileSets.push({
                id: obj.id,
                x: obj.x,
                y: obj.y
            });
        }

        console.log(JSON.stringify(tileSets));
    };

    useLayoutEffect(() => {
        const brender = BRENDER_CANVAS_REF.current;
        if (!brender) return;

        const mouseDownHandler = (e: MouseEvent) => {
            if (e.button === 0) isMouseDown = true;
            if (e.button === 2) {
                isRightMouseDown = true;
                lastMousePosition = { x: e.clientX, y: e.clientY };
            }
        };

        const mouseUpHandler = (e: MouseEvent) => {
            if (e.button === 0) isMouseDown = false;
            if (e.button === 2) isRightMouseDown = false;
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            if (isRightMouseDown) {
                const deltaX = e.clientX - lastMousePosition.x;
                const deltaY = e.clientY - lastMousePosition.y;

                brender.camera.moveBy(-deltaX / brender.camera.scale, -deltaY / brender.camera.scale);

                lastMousePosition = { x: e.clientX, y: e.clientY };
            }
        };

        const nextAvailableId = () => (brender.objects.length + 1).toString();

        const placeTile = (entity: BrenderObject) => {
            if (!tileSelected) return;

            if (brender.objects.some((obj) => obj.x === entity.x && obj.y === entity.y)) return;

            brender.createObject({
                id: `${tileSelected.id} ${nextAvailableId()}`,
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
            onFrame: () => {
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
                    entity.imageOpacity = 0.5;

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

        brender.raw.addEventListener("mousedown", mouseDownHandler);
        brender.raw.addEventListener("mouseup", mouseUpHandler);
        brender.raw.addEventListener("mousemove", mouseMoveHandler);

        return () => {
            brender.raw.removeEventListener("mousedown", mouseDownHandler);
            brender.raw.removeEventListener("mouseup", mouseUpHandler);
            brender.raw.removeEventListener("mousemove", mouseMoveHandler);
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
            <div className={styles.canvasContainer}>
                <BrenderCanvas
                    className={styles.canvas}
                    ref={BRENDER_CANVAS_REF}
                    debug={true}
                />
            </div>

            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <div className={styles.tiles}>
                        {TILES.map((tile, index) => <Component.Tile key={index} tile={tile} onClick={() => {
                            setSelectedTile(tile.id, tile.width, tile.height, tile.image);
                            mode = Mode.CREATE;
                        }} />)}
                    </div>

                    <div className={styles.tools}>
                        <Component.ToolButton
                            name="Fill"
                            icon="fas fa-fill"
                            onClick={() => mode = Mode.FILL}
                        />
                        <Component.ToolButton
                            name="Select"
                            icon="fas fa-square-dashed"
                            onClick={() => mode = Mode.SELECT}
                        />
                        <Component.ToolButton
                            name="Delete"
                            icon="fas fa-trash"
                            onClick={() => mode = Mode.DELETE}
                        />
                        <Component.ToolButton
                            name="Edit"
                            icon="fas fa-pencil-alt"
                            onClick={() => mode = Mode.EDIT}
                        />
                    </div>
                </div>

                {/* <div className={styles.bottomContainer}>
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
                            setSelectedTile(tile.id, tile.width, tile.height, tile.image);

                            mode = Mode.CREATE;
                        }}>
                            <img src={tile.image} alt={tile.id} />
                        </div>
                    ))}
                </div>

                <div className={styles.right}>
                    <Button.ClearButton>Import</Button.ClearButton>
                    <Button.ClearButton onClick={exportMap}>Export</Button.ClearButton>
                </div>
            </div> */}
            </div>
        </>
    );
}
