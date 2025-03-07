import { BrenderObject } from "@brender/index";

export const isColliding = (object1: BrenderObject, object2: BrenderObject): boolean => {
    if (!object1.hasCollision || !object2.hasCollision) return false;

    return (
        object1.x < object2.x + object2.width! &&
        object1.x + object1.width! > object2.x &&
        object1.y < object2.y + object2.height! &&
        object1.y + object1.height! > object2.y
    );
};
