import { BrenderObject } from "@brender/index";

export let objects: BrenderObject[] = [];
export let deletionQueue: BrenderObject[] = [];

export const destroyAllObjects = () => {
    objects = [];
    deletionQueue = [];
};

export * from "./createObject";
export * from "./findObject";
