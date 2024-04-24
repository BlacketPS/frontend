import Leaderboard from "./index";

export default {
    name: "Leaderboard",
    path: "/leaderboard",
    component: <Leaderboard />,
    title: `Leaderboard | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "View the top 10 players.",
    sidebar: true,
    dontUseBody: true
} as BlacketRoute;
