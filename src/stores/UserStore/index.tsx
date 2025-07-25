import { create } from "zustand";
import { PrivateUser, PermissionType } from "@blacket/types";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";

import { UserStore } from "./userStore.d";
import { useEffect } from "react";

export const useUserStore = create<UserStore>((set, get) => {
    return {
        user: null,

        setUser: (user: PrivateUser | null) => {
            if (user) {
                user.hasPermission = (permission: PermissionType) => user.permissions.includes(permission);
                user.setTokens = (tokens: number) => {
                    set({ user: { ...user, tokens } });

                    return tokens;
                };
            }

            set({ user });

            if (import.meta.env.MODE === "development") window.user = user ?? undefined;
        },

        getUserAvatarPath: () => window.constructCDNUrl("/content/blooks/Default.png"),
        getUserBannerPath: () => window.constructCDNUrl("/content/banners/Default.png"),

        getBlookAmount: (blookId: number, shiny: boolean, usr?: PrivateUser) => {
            const user = usr || get().user;
            if (!user) return 0;

            const blooks = user.blooks.filter((b) => b.blookId === blookId && b.shiny === shiny);
            return blooks.length;
        }
    };
});

export function useUser() {
    const { user, setUser, getBlookAmount } = useUserStore();

    const { blooks } = useData();
    const { resourceIdToPath } = useResource();
    const { addCachedUserWithData } = useCachedUser();

    useEffect(() => {
        if (user) addCachedUserWithData(user);
    }, [user]);

    const getUserAvatarPath = (user: PrivateUser | null): string => {
        if (!user) return window.constructCDNUrl("/content/icons/error.png");

        if (user.customAvatar)
            return `${import.meta.env.VITE_CDN_URL}/users/${user.customAvatar.userId}/${user.customAvatar.uploadId}/${user.customAvatar.filename}`;
        else if (user.avatar) {
            const blook = blooks.find((b) => b.id === user.avatar?.blookId);
            if (!blook) return window.constructCDNUrl("/content/blooks/Default.png");
            return resourceIdToPath(blook.imageId) || window.errorImage;
        }

        return window.constructCDNUrl("/content/blooks/Default.png");
    };

    const getUserBannerPath = (user: PrivateUser | null): string => {
        if (!user) return window.constructCDNUrl("/content/icons/error.png");

        if (user.customBanner)
            return `${import.meta.env.VITE_CDN_URL}/users/${user.customBanner.userId}/${user.customBanner.uploadId}/${user.customBanner.filename}`;
        else if (user.bannerId)
            return resourceIdToPath(user.bannerId) || window.errorImage;

        return window.constructCDNUrl("/content/banners/Default.png");
    };

    return {
        user,
        setUser,
        getBlookAmount,
        getUserAvatarPath,
        getUserBannerPath
    };
}
