import { createGenericEntity, BrenderEntity, PlayerEntity } from "@brender/index";

import { EntityType } from "@blacket/types";

export const createPlayerEntity = (e: PlayerEntity): PlayerEntity => {
    e.type = EntityType.PLAYER;

    const entity = createGenericEntity(e as BrenderEntity) as PlayerEntity;

    return entity;
};
