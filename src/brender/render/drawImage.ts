import { getLayerCtx, camera, isOnScreen, DrawImageProps } from "@brender/index";

const shineVideo = document.createElement("video");
shineVideo.src = window.constructCDNUrl("/content/shine.mp4");
shineVideo.muted = true;
shineVideo.loop = true;
shineVideo.play();

export const drawImage = (image: DrawImageProps) => {
    const imageCtx = getLayerCtx(image.z);

    imageCtx.save();

    if (typeof image.useCamera === "undefined") image.useCamera = true;

    // rotation, rotation is in deg
    if (image.rotation) {
        imageCtx.translate(
            (image.x - camera.x) * camera.scale + image.width * camera.scale / 2,
            (image.y - camera.y) * camera.scale + image.height * camera.scale / 2
        );
        imageCtx.rotate(image.rotation * Math.PI / 180);
        imageCtx.translate(
            -(image.x - camera.x) * camera.scale - image.width * camera.scale / 2,
            -(image.y - camera.y) * camera.scale - image.height * camera.scale / 2
        );
    }

    if (image.blendMode) imageCtx.globalCompositeOperation = image.blendMode;
    if (image.opacity) imageCtx.globalAlpha = image.opacity;

    if (
        image.shiny &&
        shineVideo instanceof HTMLVideoElement &&
        shineVideo.readyState >= 2
    ) {
        const screenX = (image.x - camera.x) * camera.scale;
        const screenY = (image.y - camera.y) * camera.scale;
        const screenW = image.width * camera.scale;
        const screenH = image.height * camera.scale;

        const baseCtx = getLayerCtx(image.z);
        const shineLayerCtx = getLayerCtx(image.z + 1);

        const shineCanvas = document.createElement("canvas");
        shineCanvas.width = screenW;
        shineCanvas.height = screenH;
        const shineCtx = shineCanvas.getContext("2d")!;

        shineCtx.globalAlpha = 0.5;
        shineCtx.globalCompositeOperation = "lighter";

        shineCtx.fillStyle = "rgba(255,255,255,1)";
        shineCtx.fillRect(0, 0, screenW, screenH);

        shineCtx.drawImage(shineVideo, 0, 0, screenW, screenH);

        shineCtx.globalCompositeOperation = "destination-in";
        shineCtx.drawImage(image.image, 0, 0, screenW, screenH);

        shineLayerCtx.drawImage(shineCanvas, screenX, screenY);

        baseCtx.save();

        baseCtx.shadowColor = "rgba(255, 255, 255, 1)";
        baseCtx.shadowBlur = 10;
        baseCtx.shadowOffsetX = 0;
        baseCtx.shadowOffsetY = 0;
        baseCtx.drawImage(image.image, screenX, screenY, screenW, screenH);

        baseCtx.restore();
    }

    if (image.useCamera && isOnScreen(image.x, image.y, image.width, image.height)) {
        imageCtx.drawImage(
            image.image,
            (image.x - camera.x) * camera.scale,
            (image.y - camera.y) * camera.scale,
            image.width * camera.scale,
            image.height * camera.scale
        );

    } else if (!image.useCamera) {
        imageCtx.drawImage(
            image.image,
            image.x,
            image.y,
            image.width,
            image.height
        );
    }

    if (image.tint) {
        imageCtx.fillStyle = image.tint;

        imageCtx.globalAlpha = 0.5;
        imageCtx.globalCompositeOperation = "source-atop";

        imageCtx.fillRect(
            image.x - camera.x,
            image.y - camera.y,
            image.width,
            image.height
        );
    }

    imageCtx.restore();
};
