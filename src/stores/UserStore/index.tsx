import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useResource } from "@stores/ResourceStore/index";

import { PermissionType, PrivateUser } from "@blacket/types";
import { type UserStoreContext } from "./userStore.d";

const UserStoreContext = createContext<UserStoreContext>({ user: null, setUser: () => { }, getUserAvatarPath: () => "" });

export function useUser() {
    return useContext(UserStoreContext);
}

export function UserStoreProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<PrivateUser | null>(null);

    const { resourceIdToPath } = useResource();

    const setUser = (user: PrivateUser | null) => {
        if (user) user.hasPermission = (permission: PermissionType) => user.permissions.includes(permission);

        setUserState(user);
    };

    const getUserAvatarPath = (user: PrivateUser | null): string => {
        if (!user) return window.constructCDNUrl("/content/blooks/Error.png");
        else if (user.customAvatar) return user.customAvatar as string;
        else if (user.avatarId) return resourceIdToPath(user.avatarId) || window.errorImage;
        else return window.constructCDNUrl("/content/blooks/Default.png");
    };

    useEffect(() => {
        if (import.meta.env.MODE === "development") window.user = user ?? undefined;
    }, [user]);

    return <UserStoreContext.Provider value={{ user, setUser, getUserAvatarPath }}>{children}</UserStoreContext.Provider>;
}
