import { DrawRectProps, getLayerCtx, camera } from "@brender/index";

export const drawRect = (rect: DrawRectProps) => {
    const rectCtx = getLayerCtx(rect.z);

    rectCtx.save();

    rectCtx.fillStyle = rect.color;


    if (rect.useCamera) {
        rectCtx.fillRect(
            (rect.x - camera.x) * camera.scale,
            (rect.y - camera.y) * camera.scale,
            rect.width * camera.scale,
            rect.height * camera.scale
        );
    } else {
        rectCtx.fillRect(
            (rect.x),
            (rect.y),
            rect.width,
            rect.height
        );
    }

    rectCtx.restore();
};
