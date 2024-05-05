import { memo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore";

export default memo(function Chat() {
    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    return (
        <h1>converting to ts</h1>
    );
});
