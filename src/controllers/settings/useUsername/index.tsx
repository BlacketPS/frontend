import { useUser } from "@stores/UserStore/index";

import { NotFound, SettingsChangeUsernameDto } from "@blacket/types";

export function useUsername() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeUsername = (dto: SettingsChangeUsernameDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/username", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, username: dto.newUsername });

            resolve(res);
        })
        .catch(reject));

    return { changeUsername };
}
