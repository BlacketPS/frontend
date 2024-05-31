import Credits from "./index";

export default {
    path: "/credits",
    component: <Credits />,
    title: `Credits | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Who made this game?",
    sidebar: true,
    topRight: [],
    pageHeader: "Credits"
} as BlacketRoute;
