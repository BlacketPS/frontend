import { useUser } from "@stores/UserStore/index";

import { NotFound } from "@blacket/types";

export function useClaimDailyTokens() {
    const { user, setUser } = useUser();
    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const claimDailyTokens = () => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put("/api/quests/claim-daily-tokens", {})
        .then((res: Fetch2Response & { data: { tokens: number } }) => {
            const previousTokens = user.tokens;
            const newTokens = previousTokens + res.data.tokens;

            const newClaimedDate = new Date();
            newClaimedDate.setUTCHours(0, 0, 0, 0);

            setUser({ ...user, tokens: newTokens, lastClaimed: newClaimedDate });

            resolve(res);
        })
        .catch(reject));

    return { claimDailyTokens };
}
