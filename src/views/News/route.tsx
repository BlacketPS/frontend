import News from "./index";

export default {
    path: "/news",
    component: <News />,
    title: `News | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: `Get the latest updates on ${import.meta.env.VITE_INFORMATION_NAME}.`,
    sidebar: true,
    topRight: [],
    pageHeader: "News"
} as BlacketRoute;
