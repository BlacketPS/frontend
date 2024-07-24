/* const UserStoreContext = createContext<{ user: PrivateUser | null, setUser: (user: PrivateUser | null) => void }>({ user: null, setUser: () => { } }); */
import { PrivateUser, User } from "blacket-types";

export interface UserStoreContext {
    user: PrivateUser | null;
    setUser: (user: PrivateUser | null) => void;
    getUserAvatarPath: (user: PrivateUser | User) => string;
}
