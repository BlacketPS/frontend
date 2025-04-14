import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useResource } from "@stores/ResourceStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";

import { PermissionType, PrivateUser } from "@blacket/types";
import { type UserStoreContext } from "./userStore.d";

import { UserAvatar } from "@blacket/types";

const UserStoreContext = createContext<UserStoreContext>({
    user: null,
    setUser: () => { },
    getUserAvatarPath: () => "",
    getUserBannerPath: () => ""
});

export function useUser() {
    return useContext(UserStoreContext);
}

export function UserStoreProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<PrivateUser | null>(null);

    const { resourceIdToPath } = useResource();
    const { addCachedUserWithData } = useCachedUser();

    const setUser = (user: PrivateUser | null) => {
        if (user) {
            user.hasPermission = (permission: PermissionType) => user.permissions.includes(permission);
            user.setTokens = (tokens: number) => {
                setUserState({ ...user, tokens });

                return tokens;
            };
        }

        setUserState(user);
    };

    const getUserAvatarPath = (user: PrivateUser | null): string => {
        if (!user) return window.constructCDNUrl("/content/icons/error.png");
        else if (user.customAvatar) return `${import.meta.env.VITE_UPLOAD_PATH}${user.customAvatar}` as string;
        else if (user.avatar) return resourceIdToPath((user.avatar as UserAvatar).resourceId) || window.errorImage;
        else return window.constructCDNUrl("/content/blooks/Default.png");
    };

    const getUserBannerPath = (user: PrivateUser | null): string => {
        if (!user) return window.constructCDNUrl("/content/icons/error.png");
        else if (user.customBanner) return `${import.meta.env.VITE_UPLOAD_PATH}${user.customBanner}` as string;
        else if (user.bannerId) return resourceIdToPath(user.bannerId) || window.errorImage;
        else return window.constructCDNUrl("/content/banners/Default.png");
    };

    useEffect(() => {
        if (import.meta.env.MODE === "development") window.user = user ?? undefined;
        if (user) addCachedUserWithData(user);
    }, [user]);

    return <UserStoreContext.Provider value={{
        user, setUser,
        getUserAvatarPath, getUserBannerPath
    }}>{children}</UserStoreContext.Provider>;
}
