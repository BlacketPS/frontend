import { PublicUser } from "@blacket/types";

export interface CachedUserStoreContext {
    cachedUsers: PublicUser[];
    setCachedUsers: (cachedUsers: PublicUser[]) => void;
    addCachedUser: (userId: string) => Promise<PublicUser>;
    addCachedUserWithData: (user: PublicUser) => void;
}
