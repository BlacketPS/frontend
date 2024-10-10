import { useUser } from "@stores/UserStore/index";

import { CosmeticsChangeTitleDto, NotFound } from "@blacket/types";

export function useChangeTitle() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeTitle = (dto: CosmeticsChangeTitleDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/title", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, titleId: dto.titleId });

            resolve(res);
        })
        .catch(reject));

    return { changeTitle };
}
