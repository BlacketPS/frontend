import { useRef, useImperativeHandle, forwardRef, useLayoutEffect, memo } from "react";
import { BrenderCanvasRef, BrenderCanvasProps } from "@brender/index.d";

import {
    _setCanvas, getCanvas, getWidth, getHeight, start, stop,
    camera,
    pressing, mousePosition,
    isMouseOver, isOnScreen, urlToImage,
    objects, createObject, findObject, destroyAllObjects,
    entities, createGenericEntity, findEntity, createPlayerEntity, destroyAllEntities,
    drawRect, drawText, drawImage,
    loadingImage
} from ".";

const BrenderCanvas = forwardRef<BrenderCanvasRef, BrenderCanvasProps>(({ width, height, style, debug = false, showFPS = false, ...props }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let canvas = canvasRef.current;

    let lastTime = Date.now();

    useImperativeHandle(ref, () => ({
        get raw() {
            return getCanvas();
        },
        objects,
        entities,
        camera,
        pressing,
        mousePosition,
        loadingImage,
        isMouseOver,
        createGenericEntity,
        createPlayerEntity,
        createObject,
        findEntity,
        findObject,
        drawRect,
        drawText,
        drawImage,
        urlToImage,
        getCanvas,
        getWidth,
        getHeight
    }));

    useLayoutEffect(() => {
        if (!canvas) canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        _setCanvas(canvas);
        start();

        if (debug) createGenericEntity({
            id: "debug",
            x: 0,
            y: 0,
            z: 0,
            onFrame: () => {
                const now = Date.now();
                const delta = now - lastTime;

                lastTime = now;
                const fps = (1000 / delta) | 0;

                drawText({ text: `Entities: ${entities.length}`, x: 7, y: getHeight() - 10, z: 999, style: { textAlign: "left" }, useCamera: false });
                drawText({ text: `Objects: ${objects.length}`, x: 7, y: getHeight() - 30, z: 999, style: { textAlign: "left" }, useCamera: false });
                drawText({ text: `Camera: ${camera.x}, ${camera.y}`, x: 7, y: getHeight() - 50, z: 999, style: { textAlign: "left" }, useCamera: false });

                if (showFPS) drawText({ text: `FPS: ${fps}`, x: getWidth() - 7, y: 20, z: 999, style: { textAlign: "right" }, useCamera: false });

                // objects.forEach((object) => {
                //     if (object.hasCollision && isOnScreen(object.x, object.y, object.width ?? object?.image?.width ?? 0, object.height ?? object?.image?.height ?? 0)) {
                //         drawRect({
                //             x: object.x,
                //             y: object.y,
                //             z: object.z ? object.z + 1 : 0,
                //             width: object.width ?? object?.image?.width ?? 0,
                //             height: object.height ?? object?.image?.height ?? 0,
                //             color: "rgba(0, 0, 255, 0.2)",
                //             useCamera: false
                //         });
                //     }
                // });

                // entities.forEach((entity) => {
                //     if (entity.hasCollision && isOnScreen(entity.x, entity.y, entity.width ?? entity?.image?.width ?? 0, entity.height ?? entity?.image?.height ?? 0)) {
                //         drawRect({
                //             x: entity.x,
                //             y: entity.y,
                //             z: entity.z ? entity.z + 1 : 0,
                //             width: entity.width ?? entity?.image?.width ?? 0,
                //             height: entity.height ?? entity?.image?.height ?? 0,
                //             color: "rgba(0, 0, 255, 0.2)",
                //             useCamera: false
                //         });
                //     }
                // });
            }
        });

        return () => {
            stop();

            destroyAllObjects();
            destroyAllEntities();

            camera.scale = 1;
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={style}
            className={props.className}
            onContextMenu={(e) => e.preventDefault()}
            tabIndex={0}
            {...props}
        />
    );
});

export default memo(BrenderCanvas);
