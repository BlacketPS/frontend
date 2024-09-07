import { createContext, useContext, useState, ReactNode } from "react";

import { type LeaderboardStoreContext } from "./leaderboard";
import { PlacementType } from "../../views/Leaderboard/leaderboard.d";
import { PublicUser } from "blacket-types";

const LeaderboardStoreContext = createContext<LeaderboardStoreContext>({
    sortBy: PlacementType.TOKEN,
    setSortBy: () => { },
    leaderboard: null,
    setLeaderboard: () => { }
});

export function useLeaderboard() {
    return useContext(LeaderboardStoreContext);
}

export function LeaderboardStoreProvider({ children }: { children: ReactNode }) {
    const [sortBy, setSortBy] = useState<PlacementType>(PlacementType.TOKEN);
    const [leaderboard, setLeaderboard] = useState<{
        tokens: PublicUser[],
        experience: PublicUser[]
    } | null>(null);

    return <LeaderboardStoreContext.Provider value={{
        sortBy, setSortBy,
        leaderboard, setLeaderboard
    }}>{children}</LeaderboardStoreContext.Provider>;
}
