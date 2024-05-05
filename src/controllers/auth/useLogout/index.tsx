import { useUser } from "@stores/UserStore";
import { useSocket } from "@stores/SocketStore";

export function useLogout() {
    const { setUser } = useUser();
    const { initializeSocket } = useSocket();

    const logout = () => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.delete("/api/auth/logout", {})
        .then((res: Fetch2Response) => {
            localStorage.removeItem("token");

            setUser(null);
            initializeSocket();

            resolve(res);
        })
        .catch(reject));

    return { logout };
}
