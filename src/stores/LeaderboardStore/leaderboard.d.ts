import { PublicUser } from "blacket-types";

export interface LeaderboardStoreContext {
    sortBy: PlacementType;
    setSortBy: (sortBy: PlacementType) => void;
    leaderboard: {
        tokens: PublicUser[];
        experience: PublicUser[];
    } | null;
    setLeaderboard: (leaderboard: {
        tokens: PublicUser[];
        experience: PublicUser[];
    }) => void;
}
