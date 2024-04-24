import { LeaderboardEntity } from "blacket-types";

export interface LeaderboardResponse extends Fetch2Response {
    data: LeaderboardEntity;
}
