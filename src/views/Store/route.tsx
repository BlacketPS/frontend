import Store from "./index";

export default {
    path: "/store",
    component: <Store />,
    title: `Store | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Purchase items from the store to enhance your experience.",
    sidebar: true,
    topRight: ["gems"],
    dontUseBody: true
} as BlacketRoute;
