import { useUser } from "@stores/UserStore/index";

import { ChangeUsernameDto } from "blacket-types";

export function useUsername() {
    const { user, setUser } = useUser();

    const changeUsername = (dto: ChangeUsernameDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/username", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, username: dto.newUsername });

            resolve(res);
        })
        .catch(reject));

    return { changeUsername };
}
