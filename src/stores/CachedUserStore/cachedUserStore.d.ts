import { PublicUser } from "blacket-types";

export interface CachedUserStoreContext {
    cachedUsers: PublicUser[];
    setCachedUsers: (cachedUsers: PublicUser[]) => void;
    addCachedUser: (userId: string) => Promise<void>;
    addCachedUserWithData: (user: PublicUser) => void;
}
