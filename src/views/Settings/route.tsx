import Settings from "./index";

export default {
    path: "/settings",
    component: <Settings />,
    title: `Settings | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Change the settings of your account.",
    sidebar: true,
    topRight: [],
    pageHeader: "Settings"
} as BlacketRoute;
