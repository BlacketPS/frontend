import Chat from "./index";

export default {
    path: "/chat",
    component: <Chat />,
    title: `Chat | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Chat with other players.",
    sidebar: true,
    topRight: []
} as BlacketRoute;
