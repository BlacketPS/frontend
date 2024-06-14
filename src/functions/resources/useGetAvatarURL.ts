import { useResource } from "@stores/ResourceStore/index";

import { User } from "blacket-types";

export default function useGetAvatarURL(user: User | null = null): string {
    const { resourceIdToPath } = useResource();

    if (!user) return "https://cdn.blacket.org/static/content/blooks/Error.png";

    if (user.customAvatar) return  "https://cdn.blacket.org/static/content/blooks/Error.png";
    else if (user.avatarId) return resourceIdToPath(user.avatarId) || "https://cdn.blacket.org/static/content/blooks/Error.png";
    else return "https://cdn.blacket.org/static/content/blooks/Default.png";
}
