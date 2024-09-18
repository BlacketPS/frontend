import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { useUsers } from "@controllers/users/useUsers";

import { type CachedUserStoreContext } from "./cachedUser.d";
import { PublicUser } from "@blacket/types";

const CachedUserStoreContext = createContext<CachedUserStoreContext>({
    cachedUsers: [],
    setCachedUsers: () => { },
    addCachedUser: () => new Promise(() => { }),
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

    const addCachedUser = (userIdOrName: string) => new Promise<PublicUser>((resolve, reject) => {
        const cachedUser = cachedUsersRef.current.find((user) => user.id === userIdOrName) || cachedUsersRef.current.find((user) => user.username.toLowerCase() === userIdOrName.toLowerCase());
        if (cachedUser) return resolve(cachedUser);

        getUser(userIdOrName)
            .then((res) => {
                setCachedUsers((previousCachedUsers) => [...previousCachedUsers, res.data]);

                resolve(res.data);
            })
            .catch((err) => reject(err));
    });

    const addCachedUserWithData = (user: PublicUser) => {
        if (cachedUsersRef.current.find((cachedUser) => cachedUser.id === user.id)) return;

        setCachedUsers((previousCachedUsers) => [...previousCachedUsers, user]);
    };

    return <CachedUserStoreContext.Provider value={{
        cachedUsers, setCachedUsers,
        addCachedUser, addCachedUserWithData
    }}>{children}</CachedUserStoreContext.Provider>;
}
