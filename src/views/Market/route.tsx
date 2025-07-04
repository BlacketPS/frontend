import Market from "./index";

export default {
    path: "/market",
    component: <Market />,
    title: `Market | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Purchase packs and items and unlock blooks.",
    sidebar: true,
    topRight: ["tokens", "gems"],
    dontUseBody: true
} as BlacketRoute;
