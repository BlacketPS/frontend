import { GetUserResponse } from "./useUsers.d";

export function useUsers() {
    const getUser = (user: string) => new Promise<GetUserResponse>((resolve, reject) => window.fetch2.get(`/api/users/${user}`)
        .then((res: GetUserResponse) => {
            resolve(res);
        })
        .catch(reject));

    return { getUser };
}
