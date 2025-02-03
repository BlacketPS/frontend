import { BrenderObject } from "@brender/index";

export let objects: BrenderObject[] = [];

export const createObject = (object: BrenderObject): BrenderObject => {
    object.destroy = () => {
        const index = objects.findIndex((o) => o.id === object.id);

        if (index !== -1) objects.splice(index, 1);
    };

    objects.push(object);

    return object;
};

export const findObject = (id: string) => objects.find((object) => object.id === id);

export const destroyAllObjects = () => objects = [];
