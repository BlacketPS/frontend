import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";

export default function Guilds() {
    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    if (user.guild) return <Navigate to="/guilds/my-guild" />;
    else return <Navigate to="/guilds/discovery" />;
}
