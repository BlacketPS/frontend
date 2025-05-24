import StaffPanel from "./index";

export default {
    path: "/staff",
    component: <StaffPanel />,
    title: `Staff Panel | ${import.meta.env.VITE_INFORMATION_NAME}`,
    pageHeader: "Staff Panel",
    sidebar: true,
    topRight: []
} as BlacketRoute;
