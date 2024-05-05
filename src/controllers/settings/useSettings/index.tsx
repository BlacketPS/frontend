import { useUser } from "@stores/UserStore/index";

export function useSettings() {
    const { user, setUser } = useUser();

    const changeSetting = (key: string, value: any) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings", { key, value })
        .then((res: Fetch2Response) => {
            setUser({ ...user, settings: { ...user.settings, [key]: value } });

            resolve(res);
        })
        .catch(reject));

    return { changeSetting };
}
