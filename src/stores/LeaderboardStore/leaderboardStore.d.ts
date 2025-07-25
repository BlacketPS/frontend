import { PublicUser } from "@blacket/types";

export interface LeaderboardStore {
    sortBy: PlacementType;
    leaderboard: {
        tokens: PublicUser[];
        experience: PublicUser[];
    } | null;
    setSortBy: (type: PlacementType) => void;
    setLeaderboard: (data: {
        tokens: PublicUser[];
        experience: PublicUser[];
    }) => void;
}
