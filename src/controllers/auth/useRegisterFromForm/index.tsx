import { useUser } from "@stores/UserStore";
import { useSocket } from "@stores/SocketStore";

import { AuthAuthEntity } from "@blacket/types";

interface RegisterDto {
    formId: string;
    password: string;
}

export function useRegisterFromForm() {
    const { setUser } = useUser();
    const { initializeSocket } = useSocket();

    const registerFormForm = (dto: RegisterDto) => new Promise((resolve, reject) => window.fetch2.post("/api/auth/register-from-form", dto)
        .then((res: Fetch2Response & { data: AuthAuthEntity }) => {
            localStorage.setItem("token", res.data.token);

            window.fetch2.get("/api/users/me").then((res: Fetch2Response) => {
                setUser(res.data);

                initializeSocket();

                resolve(res);
            })
                .catch(reject);
        })
        .catch(reject));

    return { registerFormForm };
}
