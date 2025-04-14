import { DataBoostersEntity } from "@blacket/types";

export function useBoosters() {
    const getBoosters = () => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.get("/api/data/boosters")
        .then((res: Fetch2Response & { data: DataBoostersEntity }) => resolve(res))
        .catch(reject));

    return { getBoosters };
}
