import { Navigate } from "react-router-dom";

export default {
    path: "/terms",
    component: <Navigate to="/legal" />,
    header: {}
} as BlacketRoute;
