import { SettingsChangePasswordDto } from "@blacket/types";
import { PasswordResponse } from "./usePassword.d";

export function usePassword() {
    const changePassword = (dto: SettingsChangePasswordDto) => new Promise<PasswordResponse>((resolve, reject) => window.fetch2.patch("/api/settings/password", dto)
        .then((res: PasswordResponse) => {
            localStorage.setItem("token", res.data.token);

            resolve(res);
        })
        .catch(reject));

    return { changePassword };
}
