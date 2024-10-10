import { useUser } from "@stores/UserStore/index";

import { CosmeticsChangeFontDto, NotFound } from "@blacket/types";

export function useChangeFont() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeFont = (dto: CosmeticsChangeFontDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/font", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, fontId: dto.fontId });

            resolve(res);
        })
        .catch(reject));

    return { changeFont };
}
