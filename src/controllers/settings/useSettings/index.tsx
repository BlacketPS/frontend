import { useUser } from "@stores/UserStore/index";

import { ChangeSettingDto } from "blacket-types";

export function useSettings() {
    const { user, setUser } = useUser();

    const changeSetting = (dto: ChangeSettingDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, settings: { ...user.settings, [dto.key]: dto.value } });

            resolve(res);
        })
        .catch(reject));

    return { changeSetting };
}
