import { useResource } from "@stores/ResourceStore/index";

import { User } from "blacket-types";

export default function useGetAvatarURL(user: User | null = null): string {
    const { resourceIdToPath } = useResource();

    if (!user) return "/content/blooks/Error.png";

    if (user.customAvatar) return user.customAvatarPath || "/content/blooks/Error.png";
    else if (user.avatarId) return resourceIdToPath(user.avatarId) || "/content/blooks/Error.png";
    else return "/content/blooks/Default.png";
}
