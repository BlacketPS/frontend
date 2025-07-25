import { create } from "zustand";
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

        addCachedUser: async (userIdOrName: string) => {
            const { cachedUsers } = get();

            const existingUser =
                cachedUsers.find((user) => user.id === userIdOrName) ||
                cachedUsers.find((user) => user.username.toLowerCase() === userIdOrName.toLowerCase());

            if (existingUser) return existingUser;

            const res = await getUser(userIdOrName);

            set((state) => ({
                cachedUsers: [...state.cachedUsers, res.data]
            }));

            return res.data;
        },

        addCachedUserWithData: (user: PublicUser) => {
            const { cachedUsers } = get();

            if (cachedUsers.find((cachedUser) => cachedUser.id === user.id)) return;

            set({ cachedUsers: [...cachedUsers, user] });
        }
    };
});
