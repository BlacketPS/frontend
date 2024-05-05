import Inventory from "./index";

export default {
    name: "Inventory",
    path: "/inventory",
    component: <Inventory />,
    title: `Inventory | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "View all of your items and manage them.",
    sidebar: true,
    topRight: [],
    pageHeader: "Inventory"
} as BlacketRoute;
