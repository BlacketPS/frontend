import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

import { PrivateUser } from "blacket-types";

const UserStoreContext = createContext<{ user: PrivateUser | null, setUser: (user: PrivateUser | null) => void }>({ user: null, setUser: () => { } });

export function useUser() {
    return useContext(UserStoreContext);
}

export function UserStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<PrivateUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => await window.fetch2.get("/api/users/me")
            .then((res: Fetch2Response) => setUser(res.data));

        if (localStorage.getItem("token")) fetchUser()
            .then(() => setLoading(false))
            .catch(() => {
                setError(true);

                setTimeout(() => setLoading(false), 2000);

                localStorage.removeItem("token");
            });
        else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    return <UserStoreContext.Provider value={{ user, setUser }}>{!loading ? children : <Loading error={error} message={!error ? "user data" : "user data, logging out.."} />}</UserStoreContext.Provider>;
}
