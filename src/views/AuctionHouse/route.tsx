import AuctionHouse from "./index";

export default {
    path: "/auction-house",
    component: <AuctionHouse />,
    title: `Auction House | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Buy and sell Blooks and items on the Auction House.",
    sidebar: true,
    topRight: ["tokens"],
    topRightDesktopOnly: true,
    pageHeader: "Auction House"
} as BlacketRoute;
