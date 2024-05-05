import { Pack } from "blacket-types";

export interface PackStoreContext {
    packs: Pack[];
    setPacks: (packs: Pack[]) => void;
}
