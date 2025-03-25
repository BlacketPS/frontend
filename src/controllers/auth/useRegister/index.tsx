import { useUser } from "@stores/UserStore";
import { useSocket } from "@stores/SocketStore";

import { AuthAuthEntity } from "@blacket/types";

interface RegisterDto {
    username: string;
    password: string;
}

export function useRegister() {
    const { setUser } = useUser();
    const { initializeSocket } = useSocket();

    const register = (dto: RegisterDto) => new Promise((resolve, reject) => window.fetch2.post("/api/auth/register", dto)
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

    return { register };
}
