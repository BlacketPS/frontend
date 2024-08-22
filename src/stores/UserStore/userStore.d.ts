import { PrivateUser } from "blacket-types";

export interface UserStoreContext {
    user: PrivateUser | null;
    setUser: (user: PrivateUser | null) => void;
    getUserAvatarPath: (user: PrivateUser) => string;
}
