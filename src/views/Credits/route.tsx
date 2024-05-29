import Credits from "./index";

export default {
    name: "Credits",
    path: "/credits",
    component: <Credits />,
    title: `Credits | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Who made this game?",
    sidebar: true,
    topRight: [],
    pageHeader: "Credits"
} as BlacketRoute;
