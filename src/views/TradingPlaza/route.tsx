import TradingPlaza from "./index";

export default {
    name: "Trading Plaza",
    path: "/trading-plaza",
    component: <TradingPlaza />,
    title: `Trading Plaza | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Trade your tokens and blooks with other users.",
    sidebar: true,
    topRight: ["tokens"],
    pageHeader: "Trading Plaza"
} as BlacketRoute;
