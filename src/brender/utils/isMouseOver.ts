import { BrenderObject, BrenderEntity, mousePosition } from "@brender/index";

export const isMouseOver = (object: BrenderObject | BrenderEntity) => {
    const objX = object.x;
    const objY = object.y;

    const objWidth = object.width ?? object?.image?.width ?? 0;
    const objHeight = object.height ?? object?.image?.height ?? 0;

    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;

    return mouseX >= objX && mouseX <= objX + objWidth && mouseY >= objY && mouseY <= objY + objHeight;
};
