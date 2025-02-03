import { BrenderEntity } from "@brender/index";
import { EntityType } from "@blacket/types";

export let entities: BrenderEntity[] = [];

export const createGenericEntity = (entity: BrenderEntity): BrenderEntity => {
    if (!entity.type) entity.type = EntityType.NONE;

    if (findEntity(entity.id)) return entity;

    entity.destroy = () => {
        const index = entities.findIndex((e) => e.id === entity.id);

        if (index !== -1) entities.splice(index, 1);
    };

    entities.push(entity);
    // TODO: good z index sorting system
    // entities = entities.sort((a, b) => a.z - b.z);

    return entity;
};

export const findEntity = (id: string) => entities.find((entity) => entity.id === id);

export const destroyAllEntities = () => entities = [];

export * from "./createPlayerEntity";
