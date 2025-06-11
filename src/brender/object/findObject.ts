import { objects } from "@brender/index";

export const findObject = (id: string) => objects.find((object) => object.id === id);
