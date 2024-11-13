import { Navigate } from "react-router-dom";

export default {
    path: "/privacy",
    component: <Navigate to="/legal" />,
    header: {}
} as BlacketRoute;
