import { camera, ctx, imageCtx, textCtx, isOnScreen, DrawTextProps, DrawRectProps, DrawImageProps } from "@brender/index";

export const drawRect = (rect: DrawRectProps) => {
    ctx.fillStyle = rect.color;

    ctx.fillRect(
        (rect.x - camera.x) * camera.scale,
        (rect.y - camera.y) * camera.scale,
        rect.width * camera.scale,
        rect.height * camera.scale
    );
};

export const drawText = (text: DrawTextProps) => {
    textCtx.font = `${(text.style?.fontSize ?? 15) * (text.useCamera ? camera.scale : 1)}px ${text.style?.fontFamily ?? "Nunito"}`;
    textCtx.fillStyle = text.style?.color ?? "white";
    textCtx.textAlign = text.style?.textAlign ?? "left";

    if (typeof text.useCamera === "undefined") text.useCamera = true;

    if (text.useCamera && isOnScreen(text.x, text.y, 0, 0)) {
        textCtx.fillText(text.text, (text.x - camera.x) * camera.scale, (text.y - camera.y) * camera.scale);
    } else if (!text.useCamera) {
        textCtx.fillText(text.text, text.x, text.y);
    }
};

export const drawImage = (image: DrawImageProps) => {
    imageCtx.save();

    if (typeof image.useCamera === "undefined") image.useCamera = true;
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

    imageCtx.restore();
};
