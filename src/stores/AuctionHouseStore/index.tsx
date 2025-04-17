import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@stores/SocketStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useToast } from "@stores/ToastStore/index";
import { useSearchAuction } from "@controllers/auctions/useSearchAuction/index";

import { type AuctionHouseStoreContext } from "./auctionHouse.d";
import { AuctionsAuctionEntity, AuctionsSearchAuctionDto, AuctionTypeEnum, SocketAuctionBidEntity, SocketAuctionExpireEntity, SocketMessageType, UserBlook, UserItem } from "@blacket/types";

const AuctionHouseStoreContext = createContext<AuctionHouseStoreContext>({
    loading: true,
    setLoading: () => { },
    auctions: [],
    setAuctions: () => { },
    search: {},
    setSearch: () => { },
    getAuctions: () => { }
});

export function useAuctionHouse() {
    return useContext(AuctionHouseStoreContext);
}

export function AuctionHouseStoreProvider({ children }: { children: ReactNode }) {
    const { connected, socket } = useSocket();
    const { user, setUser } = useUser();
    const { addCachedUser } = useCachedUser();
    const { blooks, items } = useData();
    const { resourceIdToPath } = useResource();
    const { createToast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [auctions, setAuctions] = useState<AuctionsAuctionEntity[]>([]);
    const [search, setSearch] = useState<AuctionsSearchAuctionDto>(JSON.parse(localStorage.getItem("AUCTION_SEARCH") || "{}"));

    const { searchAuction } = useSearchAuction();

    const navigate = useNavigate();

    const getAuctions = () => searchAuction(search)
        .then((res) => {
            localStorage.setItem("AUCTION_SEARCH", JSON.stringify(search));

            setAuctions(res.data);

            setLoading(false);
        })
        .catch(() => {
            setAuctions([]);

            setLoading(false);
        });

    const onAuctionExpire = useCallback(async (data: SocketAuctionExpireEntity) => {
        if (!user) return;

        if (!data.buyItNow && (data.sellerId === user.id && !data.buyerId) || (data.buyerId === user.id && data.sellerId !== user.id)) switch (data.type) {
            case AuctionTypeEnum.BLOOK:
                if (!data?.blook?.id) return;

                const userBlooks = user.blooks;

                userBlooks.push(data.blook as UserBlook);

                setUser({ ...user, blooks: userBlooks });

                break;
            case AuctionTypeEnum.ITEM:
                if (!data.item) return;

                const userItems = user.items;

                userItems.push(data.item as UserItem);

                setUser({ ...user, items: userItems });

                break;
        }

        const blook = data?.blook?.blookId ? blooks.find((blook) => blook.id === data?.blook?.blookId) : null;
        const item = data.item ? items.find((item) => item.id === data?.item?.itemId) : null;

        switch (true) {
            case data.sellerId !== user.id && data.buyerId === user.id && !data.buyItNow:
                createToast({
                    header: "Auction Won",
                    body: `You won a(n) ${data.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name} for ${data.price} token(s).`,
                    icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId)
                });

                break;
            case data.sellerId === user.id && data.buyerId !== null:
                const buyer = await addCachedUser(data.buyerId!);

                createToast({
                    header: "Auction Sold",
                    body: `${buyer.username} ${data.buyItNow ? "bought" : "won"} your ${data.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name} for ${data.price} token(s).`,
                    icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId)
                });

                setUser({ ...user, tokens: user.tokens + data.price });

                break;
        }

        setAuctions((previousAuctions) => previousAuctions.filter((auction) => auction.id !== data.id));
    }, [user]);

    const onAuctionBid = useCallback(async (data: SocketAuctionBidEntity) => {
        if (!user) return;

        const cachedUser = data.bidderId !== user.id ? await addCachedUser(data.bidderId) : user;

        const blook = data?.blook?.blookId ? blooks.find((blook) => blook.id === data?.blook?.blookId) : null;
        const item = data.item ? items.find((item) => item.id === data?.item?.itemId) : null;

        if (data.sellerId === user.id) createToast({
            header: "Auction Bid",
            body: `${cachedUser.username} bid ${data.amount} token(s) on your ${data.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}.`,
            icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId),
            onClick: () => navigate(`/auction-house?id=${data.auctionId}`)
        });

        if (data.bidderId !== user.id && data.bidders.includes(user.id)) createToast({
            header: "Auction Outbid",
            body: `${cachedUser.username} outbid you by ${data.amount} token(s).`,
            icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId),
            onClick: () => navigate(`/auction-house?id=${data.auctionId}`)
        });

        setAuctions((previousAuctions) => previousAuctions.map((previousAuction) => {
            if (previousAuction.id === data.auctionId) return {
                ...previousAuction,
                bids: [
                    {
                        id: data.id,
                        amount: data.amount,
                        user: cachedUser,
                        userId: cachedUser.id,
                        auctionId: previousAuction.id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    ...previousAuction.bids
                ]
            };
            else return previousAuction;
        }));
    }, [user]);

    useEffect(() => {
        if (!user) return;

        setLoading(true);

        getAuctions();
    }, [search]);

    useEffect(() => {
        if (!connected || !user || !socket) return;

        socket.on(SocketMessageType.AUCTIONS_EXPIRE, onAuctionExpire);
        socket.on(SocketMessageType.AUCTIONS_BID, onAuctionBid);

        return () => {
            socket.off(SocketMessageType.AUCTIONS_EXPIRE, onAuctionExpire);
            socket.off(SocketMessageType.AUCTIONS_BID, onAuctionBid);
        };
    }, [connected]);

    return <AuctionHouseStoreContext.Provider value={{
        loading, setLoading,
        auctions, setAuctions,
        search, setSearch,
        getAuctions
    }}>{children}</AuctionHouseStoreContext.Provider>;
}
