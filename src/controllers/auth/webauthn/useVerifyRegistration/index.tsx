import { useUser } from "@stores/UserStore/index";

export function useVerifyRegistration() {
    const { user, setUser } = useUser();
    if (!user) throw new Error("User not found");

    const verifyRegistration = (dto: any) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.post("/api/auth/webauthn/verify-registration", dto)
        .then((res: Fetch2Response) => {
            const updatedUser = {
                ...user,
                authMethods: [...user.authMethods, res.data]
            };

            setUser(updatedUser);

            resolve(res);
        })
        .catch(reject));

    return { verifyRegistration };
}
