import { useUser } from "@stores/UserStore/index";

import { NotFound, SettingsEnableOtpDto } from "@blacket/types";

export function useEnable() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const enable = (dto: SettingsEnableOtpDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/otp/enable", dto)
        .then((res: Fetch2Response) => {
            const settings = user.settings;
            settings.otpEnabled = true;

            setUser({ ...user, settings });
            
            resolve(res);
        })
        .catch(reject));

    return { enable };
}
