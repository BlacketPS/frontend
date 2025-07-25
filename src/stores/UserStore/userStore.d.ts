import { PrivateUser } from "@blacket/types";

export interface UserStore {
    user: PrivateUser | null;
    setUser: (user: PrivateUser | null) => void;
    getUserAvatarPath: (user: PrivateUser | null) => string;
    getUserBannerPath: (user: PrivateUser | null) => string;
    getBlookAmount: (blookId: number, shiny: boolean, user?: PrivateUser) => number;
}