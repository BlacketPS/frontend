import { DrawRectProps, getLayerCtx, camera } from "@brender/index";

export const drawRect = (rect: DrawRectProps) => {
    const rectCtx = getLayerCtx(rect.z);

    rectCtx.save();

    rectCtx.fillStyle = rect.color;

    rectCtx.fillRect(
        (rect.x - camera.x) * camera.scale,
        (rect.y - camera.y) * camera.scale,
        rect.width * camera.scale,
        rect.height * camera.scale
    );

    rectCtx.restore();
};
