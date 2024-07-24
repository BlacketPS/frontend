import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { useUsers } from "@controllers/users/useUsers";

import { type CachedUserStoreContext } from "./cachedUserStore.d";
import { PublicUser } from "blacket-types";

const CachedUserStoreContext = createContext<CachedUserStoreContext>({
    cachedUsers: [],
    setCachedUsers: () => { },
    addCachedUser: () => { },
    addCachedUserWithData: () => { }
});

export function useCachedUser() {
    return useContext(CachedUserStoreContext);
}

export function CachedUserStoreProvider({ children }: { children: ReactNode }) {
    const [cachedUsers, setCachedUsers] = useState<PublicUser[]>([]);

    const cachedUsersRef = useRef(cachedUsers);
    cachedUsersRef.current = cachedUsers;

    const { getUser } = useUsers();

    const addCachedUser = (userId: string) => {
        if (cachedUsersRef.current.find((user) => user.id === userId)) return;

        getUser(userId)
            .then((res) => {
                setCachedUsers((previousCachedUsers) => [...previousCachedUsers, res.data]);
            })
            .catch(() => { });
    };

    const addCachedUserWithData = (user: PublicUser) => {
        if (cachedUsersRef.current.find((cachedUser) => cachedUser.id === user.id)) return;

        setCachedUsers((previousCachedUsers) => [...previousCachedUsers, user]);
    };

    return <CachedUserStoreContext.Provider value={{
        cachedUsers, setCachedUsers,
        addCachedUser, addCachedUserWithData
    }}>{children}</CachedUserStoreContext.Provider>;
}
