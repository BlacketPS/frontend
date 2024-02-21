import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore";
import { SidebarBody } from "@components";

export default function Chat() {
    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    return (<SidebarBody>
    </SidebarBody>)
}