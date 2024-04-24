import Home from "./index";

export default {
    name: "Home",
    path: "/",
    component: <Home />,
    title: import.meta.env.VITE_INFORMATION_NAME,
    description: import.meta.env.VITE_INFORMATION_DESCRIPTION.split(",").map((word: string) => word)
} as BlacketRoute;
