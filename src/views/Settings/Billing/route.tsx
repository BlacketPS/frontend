import SettingsBilling from "./index";

export default {
    path: "/settings/billing",
    component: <SettingsBilling />,
    title: `Billing | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Manage your billing information and payment methods.",
    sidebar: true,
    topRight: [],
    pageHeader: "Billing"
} as BlacketRoute;
