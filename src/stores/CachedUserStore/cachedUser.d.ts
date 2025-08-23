import { PublicUser } from "@blacket/types";

export interface CachedUserStore {
    cachedUsers: PublicUser[];
    setCachedUsers: (users: PublicUser[]) => void;
    getCachedUser: (userIdOrName: string) => PublicUser | null;
    addCachedUser: (userIdOrName: string) => Promise<PublicUser>;
    addCachedUserWithData: (user: PublicUser) => void;
}
