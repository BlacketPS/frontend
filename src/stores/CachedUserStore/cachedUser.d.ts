import { PublicUser } from "@blacket/types";

export interface CachedUserStore {
    cachedUsers: PublicUser[];
    setCachedUsers: (users: PublicUser[]) => void;
    addCachedUser: (userIdOrName: string) => Promise<PublicUser>;
    addCachedUserWithData: (user: PublicUser) => void;
}
