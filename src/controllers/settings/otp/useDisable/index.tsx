import { useUser } from "@stores/UserStore/index";

import { DisableOtpDto } from "blacket-types";

export function useDisable() {
    const { user, setUser } = useUser();

    const disable = (dto: DisableOtpDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/otp/disable", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, settings: { ...user.settings, otpEnabled: false } });

            resolve(res);
        })
        .catch(reject));

    return { disable };
}
