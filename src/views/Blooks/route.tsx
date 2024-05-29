import Blooks from "./index";

export default {
    name: "Blooks",
    path: "/blooks",
    component: <Blooks />,
    title: `Blooks | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "View all of your blooks and manage them.",
    sidebar: true,
    topRight: ["tokens"]
} as BlacketRoute;
