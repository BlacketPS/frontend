import { useUser } from "@stores/UserStore/index";

import { NotFound, SettingsChangeSettingDto } from "@blacket/types";

export function useSettings() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeSetting = (dto: SettingsChangeSettingDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings", dto)
        .then((res: Fetch2Response) => {
            // casting any is required since we don't know the type of the setting you're changing it could be anything
            // this will never cause any issues unless it's your fault (skill issue)
            const settings: any = user.settings;
            settings[dto.key] = dto.value;

            setUser({ ...user, settings });

            resolve(res);
        })
        .catch(reject));

    return { changeSetting };
}
