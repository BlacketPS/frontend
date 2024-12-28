import { useRef, useImperativeHandle, forwardRef, useLayoutEffect, memo } from "react";
import { BrenderCanvasRef, BrenderCanvasProps, CanvasObject, Entity, Camera, TextStyle, PlayerEntity } from "@brender/index.d";
import { EntityType } from "@blacket/types";

const BrenderCanvas = forwardRef<BrenderCanvasRef, BrenderCanvasProps>(({ width, height, style, debug = false, ...props }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const animationFrameIdRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    const objectsRef = useRef<CanvasObject[]>([]);
    const entitiesRef = useRef<Entity[]>([]);

    let canvas = canvasRef.current;
    let ctx = canvas?.getContext("2d");

    let objects = objectsRef.current;
    let entities = entitiesRef.current;

    const cameraRef = useRef<Camera>({
        x: 0,
        y: 0,
        scale: 1,
        targetScale: 1,
        moveTo(x, y) {
            this.x = x;
            this.y = y;
        },
        moveBy(dx, dy) {
            this.x += dx;
            this.y += dy;
        },
        focusOn(entity) {
            if (!canvas) return;

            this.x = Math.floor(entity.x - canvas.width / 2 / this.scale + (entity.width ?? entity?.image?.width ?? 0) / 2);
            this.y = Math.floor(entity.y - canvas.height / 2 / this.scale + (entity.height ?? entity?.image?.height ?? 0) / 2);
        },
        zoom(amount) {
            this.targetScale += amount;
            this.targetScale = Math.max(.1, this.targetScale);
        }
    });

    const camera = cameraRef.current;

    const pressing: { [key: string]: boolean } = {};
    const mousePosition = { x: 0, y: 0 };

    const loadingImage = new Image();
    loadingImage.src = window.constructCDNUrl("/content/blooks/Loading.png");

    const handleKeyDown = (e: KeyboardEvent) => pressing[e.key.toLowerCase()] = true;
    const handleKeyUp = (e: KeyboardEvent) => delete pressing[e.key.toLowerCase()];
    const handleMouseMove = (e: MouseEvent) => {
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX - rect.left) / camera.scale + camera.x;
        const y = (e.clientY - rect.top) / camera.scale + camera.y;

        mousePosition.x = x;
        mousePosition.y = y;
    };

    const start = () => {
        animationFrameIdRef.current = requestAnimationFrame(frame);
    };

    const stop = () => {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
    };

    const offscreenImageCanvas = new OffscreenCanvas(0, 0);
    const offscreenImageCtx = offscreenImageCanvas.getContext("2d");

    const offscreenTextCanvas = new OffscreenCanvas(0, 0);
    const offscreenTextCtx = offscreenTextCanvas.getContext("2d");

    const initializeCanvases = () => {
        if (!offscreenImageCtx || !offscreenTextCtx || !canvas) return;

        offscreenImageCanvas.width = canvas.width;
        offscreenImageCanvas.height = canvas.height;

        offscreenTextCanvas.width = canvas.width;
        offscreenTextCanvas.height = canvas.height;
    };

    const isOnScreen = (x: number, y: number, w: number, h: number) => (
        x + w >= camera.x &&
        x <= camera.x + canvas!.width / camera.scale &&
        y + h >= camera.y &&
        y <= camera.y + canvas!.height / camera.scale
    );

    const isMouseOver = (object: CanvasObject | Entity) => {
        const objX = object.x;
        const objY = object.y;

        const objWidth = object.width ?? object?.image?.width ?? 0;
        const objHeight = object.height ?? object?.image?.height ?? 0;

        const mouseX = mousePosition.x;
        const mouseY = mousePosition.y;

        return mouseX >= objX && mouseX <= objX + objWidth && mouseY >= objY && mouseY <= objY + objHeight;
    };

    const drawImage = (
        image: HTMLImageElement,
        x: number, y: number, w: number, h: number,
        blendMode?: GlobalCompositeOperation,
        opacity?: number
    ) => {
        if (!offscreenImageCtx) return;
        offscreenImageCtx.save();

        if (blendMode) offscreenImageCtx.globalCompositeOperation = blendMode;
        if (opacity) offscreenImageCtx.globalAlpha = opacity;

        offscreenImageCtx.drawImage(
            image,
            (x - camera.x) * camera.scale,
            (y - camera.y) * camera.scale,
            w * camera.scale,
            h * camera.scale
        );

        offscreenImageCtx.restore();
    };

    const renderText = (text: string, x: number, y: number, style?: TextStyle, useCamera: boolean = true) => {
        if (!offscreenTextCtx) return;

        offscreenTextCtx.font = `${(style?.fontSize ?? 15) * (useCamera ? camera.scale : 1)}px ${style?.fontFamily ?? "Nunito"}`;
        offscreenTextCtx.fillStyle = style?.color ?? "white";
        offscreenTextCtx.textAlign = style?.textAlign ?? "left";

        if (useCamera && isOnScreen(x, y, 0, 0)) {
            offscreenTextCtx.fillText(text, (x - camera.x) * camera.scale, (y - camera.y) * camera.scale);
        } else if (!useCamera) {
            offscreenTextCtx.fillText(text, x, y);
        }
    };

    const renderRect = (x: number, y: number, w: number, h: number, color: string) => {
        if (!ctx) return;

        ctx.fillStyle = color;
        ctx.fillRect(
            (x - camera.x) * camera.scale,
            (y - camera.y) * camera.scale,
            w * camera.scale,
            h * camera.scale
        );
    };

    const getWidth = () => canvas?.width ?? 0;
    const getHeight = () => canvas?.height ?? 0;

    const frame = (time: number) => {
        if (!canvas || !ctx || !offscreenImageCtx || !offscreenTextCtx) return;

        let fps;

        if (camera.scale !== camera.targetScale) camera.scale = window.lerp(camera.scale, camera.targetScale ?? 1, .2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const deltaTime = (time - lastTimeRef.current) / 8.33;
        if (debug) fps = Math.round(1000 / (time - lastTimeRef.current));
        lastTimeRef.current = time;

        ctx.drawImage(offscreenImageCanvas, 0, 0);
        offscreenImageCtx.clearRect(0, 0, offscreenImageCanvas.width, offscreenImageCanvas.height);

        ctx.drawImage(offscreenTextCanvas, 0, 0);
        offscreenTextCtx.clearRect(0, 0, offscreenTextCanvas.width, offscreenTextCanvas.height);

        for (const object of objects) {
            if (
                object.image
                && isOnScreen(object.x, object.y, object.width ?? object?.image?.width ?? 0, object.height ?? object?.image?.height ?? 0)
            ) drawImage(
                object.image,
                object.x, object.y, object.width ?? object.image.width, object.height ?? object.image.height,
                object.imageBlendMode,
                object.imageOpacity
            );

            if (object.onClick && isMouseOver(object)) object.onClick(object);
            if (object.onFrame) object.onFrame(object, deltaTime);

            if (!object.destroy) object.destroy = () => objects = objects.filter((o) => o !== object);
        }

        for (const entity of entities) {
            if (entity.image && isOnScreen(entity.x, entity.y, entity.width ?? entity?.image?.width ?? 0, entity.height ?? entity?.image?.height ?? 0)) drawImage(entity.image, entity.x, entity.y, entity.width ?? entity.image.width, entity.height ?? entity.image.height);

            if (entity.onClick && isMouseOver(entity)) entity.onClick(entity);
            if (entity.onFrame) entity.onFrame(entity, deltaTime);

            if (!entity.destroy) entity.destroy = () => entities = entities.filter((e) => e !== entity);
        }

        if (debug) {
            renderText("Running BlacketRender Engine v0.0.1", 7, canvas.height - 10, {}, false);
            renderText(`Entities: ${entities.length}`, 7, canvas.height - 30, {}, false);
            renderText(`Objects: ${objects.length}`, 7, canvas.height - 50, {}, false);
            renderText(`Camera: ${camera.x}, ${camera.y}`, 7, canvas.height - 70, {}, false);

            renderText(`FPS: ${fps ?? "???"}`, canvas.width - 7, canvas.height - 10, { textAlign: "right" }, false);
        }

        animationFrameIdRef.current = requestAnimationFrame(frame);
    };

    const cachedImages = new Map<string, HTMLImageElement>();

    const urlToImage = (url: string) => new Promise<HTMLImageElement>((resolve) => {
        if (cachedImages.has(url)) return resolve(cachedImages.get(url)!);

        const image = new Image();
        image.src = url;

        image.onload = () => {
            cachedImages.set(url, image);

            resolve(image);
        };
    });

    const createObject = (object: CanvasObject): CanvasObject => {
        objects.push(object);

        return object;
    };

    const findObject = (id: string) => objects.find((object) => object.id === id);

    const createGenericEntity = (entity: Entity): Entity => {
        if (!entity.type) entity.type = EntityType.NONE;

        if (findEntity(entity.id)) return entity;

        entities.push(entity);
        entities = entities.sort((a, b) => a.z - b.z);

        return entity;
    };

    const createPlayerEntity = (entity: PlayerEntity): PlayerEntity => {
        entity.type = EntityType.PLAYER;

        return createGenericEntity(entity as Entity) as PlayerEntity;
    };

    const findEntity = (id: string) => entities.find((entity) => entity.id === id);

    useImperativeHandle(ref, () => ({
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
        renderRect,
        renderText,
        urlToImage,
        getWidth,
        getHeight
    }));

    useLayoutEffect(() => {
        if (!canvas) canvas = canvasRef.current;
        if (!ctx) ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        document.addEventListener("mousemove", handleMouseMove);

        initializeCanvases();

        start();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("mousemove", handleMouseMove);

            stop();
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
