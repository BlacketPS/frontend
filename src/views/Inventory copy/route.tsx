import Inventory from "./index";

export default {
    path: "/inventory",
    component: <Inventory />,
    title: `Inventory | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Manage all of your avatars and items.",
    sidebar: true,
    topRight: ["tokens"],
    topRightDesktopOnly: true
} as BlacketRoute;
