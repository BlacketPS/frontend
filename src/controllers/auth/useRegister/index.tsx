import { useUser } from "@stores/UserStore";
import { useSocket } from "@stores/SocketStore";

import { RegisterResponse } from "./useRegister.d";

export function useRegister() {
    const { setUser } = useUser();
    const { initializeSocket } = useSocket();

    const register = (username: string, password: string, accessCode: string, acceptedTerms: boolean) => new Promise<RegisterResponse>((resolve, reject) => window.fetch2.post("/api/auth/register", { username, password, accessCode, acceptedTerms })
        .then((res: RegisterResponse) => {
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
