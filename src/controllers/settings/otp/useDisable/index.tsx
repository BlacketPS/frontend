import { useUser } from "@stores/UserStore/index";

import { NotFound, SettingsDisableOtpDto } from "blacket-types";

export function useDisable() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const disable = (dto: SettingsDisableOtpDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/otp/disable", dto)
        .then((res: Fetch2Response) => {
            const settings = user.settings;
            settings.otpEnabled = false;

            setUser({ ...user, settings });

            resolve(res);
        })
        .catch(reject));

    return { disable };
}
