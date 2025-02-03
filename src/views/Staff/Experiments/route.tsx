import Experiments from "./index";

export default {
    path: "/staff/experiments",
    component: <Experiments />,
    title: `Experiments | ${import.meta.env.VITE_INFORMATION_NAME}`,
    pageHeader: "Experiments",
    sidebar: true,
    topRight: []
} as BlacketRoute;
