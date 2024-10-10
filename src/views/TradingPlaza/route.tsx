import TradingPlaza from "./index";

export default {
    path: "/trading-plaza",
    component: <TradingPlaza />,
    title: `Trading Plaza | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Trade your tokens and blooks with other users.",
    sidebar: true
} as BlacketRoute;
