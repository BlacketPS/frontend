import { isOnScreen, drawImage, isMouseOver, BrenderObject } from "@brender/index";

export const objectLoop = (object: BrenderObject, deltaTime: number) => {
    if (
        object.image
        && isOnScreen(object.x, object.y, object.width ?? object?.image?.width ?? 0, object.height ?? object?.image?.height ?? 0)
    ) drawImage({
        image: object.image,
        x: object.x,
        y: object.y,
        width: object.width ?? object.image.width,
        height: object.height ?? object.image.height,
        blendMode: object.imageBlendMode,
        opacity: object.imageOpacity
    });

    if (object.onClick && isMouseOver(object)) object.onClick(object);
    if (object.onFrame) object.onFrame(object, deltaTime);
};
