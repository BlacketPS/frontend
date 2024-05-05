import { ChangePasswordDto } from "blacket-types";
import { PasswordResponse } from "./usePassword.d";

export function usePassword() {
    const changePassword = (dto: ChangePasswordDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/password", dto)
        .then((res: PasswordResponse) => {
            localStorage.setItem("token", res.data.token);

            resolve(res);
        })
        .catch(reject));

    return { changePassword };
}
