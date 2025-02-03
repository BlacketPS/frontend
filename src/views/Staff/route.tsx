import StaffPanel from "./index";

export default {
    path: "/staff",
    component: <StaffPanel />,
    title: `Staff | ${import.meta.env.VITE_INFORMATION_NAME}`,
    pageHeader: "Panel",
    sidebar: true,
    topRight: []
} as BlacketRoute;
