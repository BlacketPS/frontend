export interface LeaderboardStore {
    sortBy: PlacementType;
    leaderboard: {
        diamonds: string[];
        experience: string[];
    } | null;
    setSortBy: (type: PlacementType) => void;
    setLeaderboard: (data: {
        diamonds: string[];
        experience: string[];
    }) => void;
}
