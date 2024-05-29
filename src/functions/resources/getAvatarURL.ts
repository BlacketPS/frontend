import { PublicUser } from "blacket-types";

export default function getAvatarURL(user: PublicUser): string {
    if (user.customAvatar) return user.customAvatar;
    else if (user.avatar) return user.avatar;
    else return "/content/blooks/Default.png";
}
