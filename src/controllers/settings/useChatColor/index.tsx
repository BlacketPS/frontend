import { useUser } from "@stores/UserStore/index";

import { NotFound, SettingsChangeChatColorDto } from "@blacket/types";

export function useChatColor() {
    const { user, setUser } = useUser();
    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const changeChatColor = (dto: SettingsChangeChatColorDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.patch("/api/settings/chat-color", dto)
        .then((res: Fetch2Response) => {
            const newSettings = { ...user.settings, chatColor: dto.color };

            setUser({ ...user, settings: newSettings });

            resolve(res);
        })
        .catch(reject));

    return { changeChatColor };
}
