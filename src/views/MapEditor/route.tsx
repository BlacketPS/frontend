import MapEditor from "./index";

export default {
    path: "/map-editor",
    component: <MapEditor />,
    title: `Map Editor | ${import.meta.env.VITE_INFORMATION_NAME}`,
    sidebar: true
} as BlacketRoute;
