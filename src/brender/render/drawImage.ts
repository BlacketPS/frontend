import { getLayerCtx, camera, isOnScreen, DrawImageProps } from "@brender/index";

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
