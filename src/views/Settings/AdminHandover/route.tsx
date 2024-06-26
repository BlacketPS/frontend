import SettingsAdminHandover from "./index";

export default {
    path: "/settings/admin-handover",
    component: <SettingsAdminHandover />,
    title: `Admin Handover | ${import.meta.env.VITE_INFORMATION_NAME}`,
    sidebar: true,
    topRight: []
} as BlacketRoute;
