import Landing from "./index";

export default {
    path: "/landing",
    component: <Landing />,
    title: import.meta.env.VITE_INFORMATION_NAME,
    description: import.meta.env.VITE_INFORMATION_DESCRIPTION.split(",").map((word: string) => word)
} as BlacketRoute;
