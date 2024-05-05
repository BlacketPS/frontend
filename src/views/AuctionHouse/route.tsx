import AuctionHouse from "./index";

export default {
    name: "Auction House",
    path: "/auction-house",
    component: <AuctionHouse />,
    title: `Auction House | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Buy and sell Blooks and items on the Auction House.",
    sidebar: true,
    topRight: ["tokens"],
    pageHeader: "Auction House"
} as BlacketRoute;
