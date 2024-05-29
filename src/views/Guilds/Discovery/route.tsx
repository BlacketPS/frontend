import GuildDiscovery from "./index";

export default {
    name: "Guild Discovery",
    path: "/guilds/discovery",
    component: <GuildDiscovery />,
    title: `Guild Discovery | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Discover and join a guild to compete with other players and guilds.",
    sidebar: true,
    topRight: [],
    pageHeader: "Guild Discovery"
} as BlacketRoute;
