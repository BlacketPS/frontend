import { useUser } from "@stores/UserStore/index";

import { CosmeticsChangeColorTier1Dto, CosmeticsChangeColorTier2Dto, NotFound } from "@blacket/types";

export function useChangeColor() {
    const { user, setUser } = useUser();
    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeColorTier1 = (dto: CosmeticsChangeColorTier1Dto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/color/1", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, color: dto.color });

            resolve(res);
        })
        .catch(reject));

    const changeColorTier2 = (dto: CosmeticsChangeColorTier2Dto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/color/2", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, color: dto.color });

            resolve(res);
        })
        .catch(reject));

    return { changeColorTier1, changeColorTier2 };
}
