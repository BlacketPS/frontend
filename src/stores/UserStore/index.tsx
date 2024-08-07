import { ReactNode, createContext, useContext, useState } from "react";
import { useResource } from "@stores/ResourceStore/index";

import { PrivateUser } from "blacket-types";
import { type UserStoreContext } from "./userStore.d";

const UserStoreContext = createContext<UserStoreContext>({ user: null, setUser: () => { }, getUserAvatarPath: () => "" });

export function useUser() {
    return useContext(UserStoreContext);
}

export function UserStoreProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<PrivateUser | null>(null);

    const { resourceIdToPath } = useResource();

    const getUserAvatarPath = (user: PrivateUser | null): string => {
        if (!user) return import.meta.env.VITE_CDN_URL + "/content/blooks/Error.png";
        else if (user.customAvatar) return import.meta.env.VITE_CDN_URL + "/content/blooks/Error.png";
        else if (user.avatarId) return resourceIdToPath(user.avatarId) || import.meta.env.VITE_CDN_URL + "/content/blooks/Error.png";
        else return import.meta.env.VITE_CDN_URL + "/content/blooks/Default.png";
    };

    return <UserStoreContext.Provider value={{ user, setUser, getUserAvatarPath }}>{children}</UserStoreContext.Provider>;
}
