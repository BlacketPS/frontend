import { LeaderboardEntity } from "blacket-types";

export interface LeaderboardStoreContext {
    sortBy: PlacementType;
    setSortBy: (sortBy: PlacementType) => void;
    leaderboard: LeaderboardEntity | null;
    setLeaderboard: (leaderboard: LeaderboardEntity) => void;
}
