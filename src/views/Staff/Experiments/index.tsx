import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { ZoeySign } from "@components/index";

export default function Experiments() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;

    return (
        <>
            <ZoeySign style={{width: "400px"}}>
                aa
            </ZoeySign>
        </>
    );
}
