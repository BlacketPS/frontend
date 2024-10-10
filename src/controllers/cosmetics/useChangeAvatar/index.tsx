import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { CosmeticsChangeAvatarDto, NotFound } from "@blacket/types";

export function useChangeAvatar() {
    const { user, setUser } = useUser();
    const { blooks } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeAvatar = (dto: CosmeticsChangeAvatarDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/avatar", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, avatarId: blooks.find((blook) => blook.id === dto.blookId)!.imageId });

            resolve(res);
        })
        .catch(reject));

    return { changeAvatar };
}
