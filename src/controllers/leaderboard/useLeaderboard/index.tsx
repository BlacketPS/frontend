import { useLeaderboard as useLeaderboardStore } from "@stores/LeaderboardStore/index";

import { LeaderboardResponse } from "./useLeaderboard.d";

export function useLeaderboard() {
    const { setLeaderboard } = useLeaderboardStore();

    const getLeaderboard = () => new Promise<LeaderboardResponse>((resolve, reject) => window.fetch2.get("/api/leaderboard")
        .then((res: LeaderboardResponse) => {
            setLeaderboard(res.data);

            resolve(res);
        })
        .catch(reject));

    return { getLeaderboard };
}
