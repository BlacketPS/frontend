import { useUser } from "@stores/UserStore/index";

import { EnableOtpDto } from "blacket-types";

export function useEnable() {
    const { user, setUser } = useUser();

    const enable = (dto: EnableOtpDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/otp/enable", dto)
        .then((res: Fetch2Response) => {
            setUser({ ...user, settings: { ...user.settings, otpEnabled: true } });

            resolve(res);
        })
        .catch(reject));

    return { enable };
}
