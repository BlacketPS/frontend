import { useRef, useImperativeHandle, forwardRef, useLayoutEffect, memo } from "react";
import { BrenderCanvasRef, BrenderCanvasProps } from "@brender/index.d";

import {
    _setCanvas, getCanvas, getWidth, getHeight, start, stop,
    camera,
    pressing, mousePosition,
    isMouseOver, urlToImage,
    objects, createObject, findObject, destroyAllObjects,
    entities, createGenericEntity, findEntity, createPlayerEntity, destroyAllEntities,
    drawRect, drawText, drawImage,
    loadingImage
} from ".";

const BrenderCanvas = forwardRef<BrenderCanvasRef, BrenderCanvasProps>(({ width, height, style, debug = false, ...props }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let canvas = canvasRef.current;

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
                drawText({ text: `Entities: ${entities.length}`, x: 7, y: getHeight() - 10, style: { textAlign: "left" }, useCamera: false });
                drawText({ text: `Objects: ${objects.length}`, x: 7, y: getHeight() - 30, style: { textAlign: "left" }, useCamera: false });
                drawText({ text: `Camera: ${camera.x}, ${camera.y}`, x: 7, y: getHeight() - 50, style: { textAlign: "left" }, useCamera: false });
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
