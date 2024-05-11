import { PublicUser } from "blacket-types";

export interface CachedUserStoreContext {
    cachedUsers: PublicUser[];
    setCachedUsers: (cachedUsers: PublicUser[]) => void;
    addCachedUser: (userId: string) => void;
    addCachedUserWithData: (user: PublicUser) => void;
}
