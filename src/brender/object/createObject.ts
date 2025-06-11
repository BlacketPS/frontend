import { BrenderObject, deletionQueue, objects } from "@brender/index";

export const createObject = (object: BrenderObject): BrenderObject => {
    object.destroy = () => {
        // const index = objects.findIndex((o) => o.id === object.id);

        // if (index !== -1) objects.splice(index, 1);

        deletionQueue.push(object);
    };

    objects.push(object);

    return object;
};
