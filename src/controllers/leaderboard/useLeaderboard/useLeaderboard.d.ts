export interface LeaderboardResponse extends Fetch2Response {
    data: {
        diamonds: string[];
        experience: string[];
    };
}
