import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";

export default function Experiments() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;

    return (
        <>

        </>
    );
}
