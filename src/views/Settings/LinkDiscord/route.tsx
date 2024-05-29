import SettingsLinkDiscord from "./index";

export default {
    name: "SettingsLinkDiscord",
    path: "/settings/link-discord",
    component: <SettingsLinkDiscord />,
    title: `Link Discord | ${import.meta.env.VITE_INFORMATION_NAME}`,
    sidebar: true,
    topRight: []
} as BlacketRoute;
