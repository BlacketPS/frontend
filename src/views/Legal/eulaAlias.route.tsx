import { Navigate } from "react-router-dom";

export default {
    path: "/eula",
    component: <Navigate to="/legal" />,
    header: {}
} as BlacketRoute;
