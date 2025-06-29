import { isOnScreen, drawImage, isMouseOver, BrenderEntity } from "@brender/index";

export const entityLoop = (entity: BrenderEntity, deltaTime: number) => {
    if (
        entity.image
        && isOnScreen(entity.x, entity.y, entity.width ?? entity?.image?.width ?? 0, entity.height ?? entity?.image?.height ?? 0)
    ) drawImage({
        image: entity.image,
        x: entity.x,
        y: entity.y,
        z: entity.z,
        width: entity.width ?? entity.image.width,
        height: entity.height ?? entity.image.height,
        blendMode: entity.imageBlendMode,
        tint: entity.imageTint ?? undefined,
        shiny: entity.imageShiny ?? false,
        rotation: entity.rotation ?? undefined,
        opacity: entity.imageOpacity
    });

    if (entity.onClick && isMouseOver(entity)) entity.onClick(entity);
    if (entity.onFrame) entity.onFrame(entity, deltaTime);
};
