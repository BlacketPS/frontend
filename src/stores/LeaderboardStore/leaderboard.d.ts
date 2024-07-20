import { LeaderboardLeaderboardEntity } from "blacket-types";

export interface LeaderboardStoreContext {
    sortBy: PlacementType;
    setSortBy: (sortBy: PlacementType) => void;
    leaderboard: LeaderboardLeaderboardEntity | null;
    setLeaderboard: (leaderboard: LeaderboardLeaderboardEntity) => void;
}
