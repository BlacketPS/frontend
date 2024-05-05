import Dashboard from "./index";

export default {
    name: "Dashboard",
    path: "/dashboard",
    component: <Dashboard />,
    title: `Dashboard | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "View the statistics of your account or others accounts.",
    sidebar: true,
    topRight: [],
    pageHeader: "Dashboard (will be changed)"
} as BlacketRoute;
