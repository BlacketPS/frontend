import { create } from "zustand";
import { PlacementType } from "../../views/Leaderboard/leaderboard.d";

import { LeaderboardStore } from "./leaderboardStore.d";

export const useLeaderboard = create<LeaderboardStore>((set) => ({
    sortBy: PlacementType.DIAMONDS,
    leaderboard: null,
    setSortBy: (type) => set({ sortBy: type }),
    setLeaderboard: (data) => set({ leaderboard: data })
}));
