import { DrawTextProps, getLayerCtx, camera, isOnScreen } from "@brender/index";

export const drawText = (text: DrawTextProps) => {
    const textCtx = getLayerCtx(text.z);

    textCtx.save();

    textCtx.font = `${(text.style?.fontSize ?? 15) * (text.useCamera ? camera.scale : 1)}px ${text.style?.fontFamily ?? "Nunito"}`;
    textCtx.fillStyle = text.style?.color ?? "white";
    textCtx.textAlign = text.style?.textAlign ?? "left";

    if (typeof text.useCamera === "undefined") text.useCamera = true;

    if (text.useCamera && isOnScreen(text.x, text.y, 0, 0)) {
        textCtx.fillText(text.text, (text.x - camera.x) * camera.scale, (text.y - camera.y) * camera.scale);
    } else if (!text.useCamera) {
        textCtx.fillText(text.text, text.x, text.y);
    }

    textCtx.restore();
};
