import { Blook } from "blacket-types";

export interface BlookStoreContext {
    blooks: Blook[],
    setBlooks: (blooks: Blook[]) => void
}
