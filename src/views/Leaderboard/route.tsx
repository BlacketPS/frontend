import Leaderboard from "./index";

export default {
    path: "/leaderboard",
    component: <Leaderboard />,
    title: `Leaderboard | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "View the top 10 players.",
    sidebar: true,
    topRight: [],
    dontUseBody: true
} as BlacketRoute;
