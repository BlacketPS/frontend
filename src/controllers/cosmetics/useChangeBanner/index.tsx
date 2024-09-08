import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { CosmeticsChangeBannerDto, NotFound } from "blacket-types";

export function useChangeBanner() {
    const { user, setUser } = useUser();
    const { banners } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeBanner = (dto: CosmeticsChangeBannerDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/banner", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, bannerId: banners.find((banner) => banner.id === dto.bannerId)!.imageId });

            resolve(res);
        })
        .catch(reject));

    return { changeBanner };
}
