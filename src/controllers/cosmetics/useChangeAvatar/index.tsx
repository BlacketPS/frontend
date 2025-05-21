import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";

import { CosmeticsChangeAvatarDto, CosmeticsUploadAvatarDto, NotFound } from "@blacket/types";

export function useChangeAvatar() {
    const { user, setUser } = useUser();
    const { blooks } = useData();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeAvatar = (dto: CosmeticsChangeAvatarDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/cosmetics/avatar", dto)
        .then((res: Fetch2Response) => {
            if (dto.id === 0) {
                setUser({ ...user, avatar: undefined, customAvatar: undefined });

                resolve(res);
            } else {
                const blook = user.blooks.filter((blook) => blook.id === dto.id)[0];

                setUser({
                    ...user, avatar: {
                        ...blook,
                        resourceId: blooks.filter((b) => b.id === blook.blookId)[0].imageId
                    }
                });

                resolve(res);
            }
        })
        .catch(reject));

    const uploadAvatar = (dto: CosmeticsUploadAvatarDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.post("/api/cosmetics/avatar/upload", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, customAvatar: res.data });

            resolve(res);
        })
        .catch(reject));

    return { changeAvatar, uploadAvatar };
}
