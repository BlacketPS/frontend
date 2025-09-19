import { useUser } from "@stores/UserStore/index";

import { UserWebAuthn } from "@blacket/types";
interface Response extends Fetch2Response {
    data: UserWebAuthn;
}

export function useVerifyRegistration() {
    const { user, setUser } = useUser();
    if (!user) throw new Error("User not found");

    const verifyRegistration = (dto: any) => new Promise<Response>((resolve, reject) => window.fetch2.post("/api/auth/webauthn/verify-registration", dto)
        .then((res: Response) => {
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
