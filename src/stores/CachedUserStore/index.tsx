import { create } from "zustand";
import { useUserStore } from "@stores/UserStore/index";
import { useUsers } from "@controllers/users/useUsers";

import { CachedUserStore } from "./cachedUser.d";
import { PublicUser } from "@blacket/types";

export const useCachedUser = create<CachedUserStore>((set, get) => {
    const { getUser } = useUsers();

    return {
        cachedUsers: [],

        setCachedUsers: (users) => set((s) => {
            const existingUsers = s.cachedUsers.map((u) => u.id);
            const newUsers = users.filter((u) => !existingUsers.includes(u.id));

            return { cachedUsers: [...s.cachedUsers, ...newUsers] };
        }),

        getCachedUser: (userIdOrName: string) => {
            const { cachedUsers } = get();

            return (
                cachedUsers.find((user) => user.id === userIdOrName) ||
                (typeof userIdOrName === "string"
                    ? cachedUsers.find((user) => user.username.toLowerCase() === userIdOrName.toLowerCase())
                    : undefined)
            );
        },

        addCachedUser: async (userIdOrName: string) => {
            const { cachedUsers } = get();
            const { user } = useUserStore.getState();

            const existingUser =
                cachedUsers.find((user) => user.id === userIdOrName) ||
                (typeof userIdOrName === "string"
                    ? cachedUsers.find((user) => user.username.toLowerCase() === userIdOrName.toLowerCase())
                    : undefined);

            if (existingUser) return existingUser;

            const dummyUser = { ...user, id: userIdOrName, username: userIdOrName, avatar: undefined, bannerId: undefined } as PublicUser;
            set((state) => ({ cachedUsers: [...state.cachedUsers, dummyUser] }));

            const res = await getUser(userIdOrName);
            set((state) => ({ cachedUsers: state.cachedUsers.map((user) => user.id === userIdOrName ? res.data : user) }));

            return res.data;
        },

        addCachedUserWithData: (user: PublicUser) => {
            const { cachedUsers } = get();

            if (cachedUsers.find((cachedUser) => cachedUser.id === user.id)) return;

            set({ cachedUsers: [...cachedUsers, user] });
        }
    };
});
