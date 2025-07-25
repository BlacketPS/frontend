import { create } from "zustand";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuctionTypeEnum, SocketAuctionBidEntity, SocketAuctionExpireEntity, SocketMessageType, UserBlook, UserItem } from "@blacket/types";

import { useSocket } from "@stores/SocketStore";
import { useUser } from "@stores/UserStore";
import { useCachedUser } from "@stores/CachedUserStore";
import { useData } from "@stores/DataStore";
import { useResource } from "@stores/ResourceStore";
import { useToast } from "@stores/ToastStore";
import { useSearchAuction } from "@controllers/auctions/useSearchAuction";

import { AuctionHouseStore } from "./auctionHouse.d";

const useAuctionHouseStore = create<AuctionHouseStore>((set, get) => ({
    loading: false,
    auctions: [],
    search: JSON.parse(localStorage.getItem("AUCTION_SEARCH") || "{}"),
    setLoading: (loading) => set({ loading }),
    setAuctions: (auctions) => {
        if (typeof auctions === "function") {
            set((state) => ({ auctions: auctions(state.auctions) }));
        } else {
            set({ auctions });
        }
    },
    setSearch: (search) => set({ search }),
    getAuctions: () => {
        const { search } = get();
        const { searchAuction } = useSearchAuction();

        set({ loading: true });

        searchAuction(search)
            .then((res) => {
                localStorage.setItem("AUCTION_SEARCH", JSON.stringify(search));
                set({ auctions: res.data, loading: false });
            })
            .catch(() => set({ auctions: [], loading: false }));
    }
}));

export function useAuctionHouse() {
    const navigate = useNavigate();

    const { connected, socket } = useSocket();
    const { user, setUser } = useUser();
    const { addCachedUser } = useCachedUser();
    const { blooks, items } = useData();
    const { resourceIdToPath } = useResource();
    const { createToast } = useToast();

    const {
        loading,
        setLoading,
        auctions,
        setAuctions,
        search,
        setSearch,
        getAuctions
    } = useAuctionHouseStore();

    const onAuctionExpire = useCallback(async (data: SocketAuctionExpireEntity) => {
        if (!user) return;

        if (
            !data.buyItNow &&
            ((data.sellerId === user.id && !data.buyerId) ||
                (data.buyerId === user.id && data.sellerId !== user.id))
        ) {
            switch (data.type) {
                case AuctionTypeEnum.BLOOK:
                    if (!data?.blook?.id) return;
                    setUser({ ...user, blooks: [...user.blooks, data.blook as UserBlook] });
                    break;
                case AuctionTypeEnum.ITEM:
                    if (!data.item) return;
                    setUser({ ...user, items: [...user.items, data.item as UserItem] });
                    break;
            }
        }

        const blook = data?.blook?.blookId
            ? blooks.find((b) => b.id === data?.blook?.blookId)
            : null;
        const item = data.item
            ? items.find((i) => i.id === data?.item?.itemId)
            : null;

        if (data.sellerId !== user.id && data.buyerId === user.id && !data.buyItNow) {
            createToast({
                header: "Auction Won",
                body: `You won a(n) ${data.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name} for ${data.price} token(s).`,
                icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId)
            });
        }

        if (data.sellerId === user.id && data.buyerId !== null) {
            const buyer = await addCachedUser(data.buyerId!);
            createToast({
                header: "Auction Sold",
                body: `${buyer.username} ${data.buyItNow ? "bought" : "won"} your ${data.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name} for ${data.price} token(s).`,
                icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId)
            });
            setUser({ ...user, tokens: user.tokens + data.price });
        }

        setAuctions((prev) => prev.filter((auction) => auction.id !== data.id));
    }, [user]);

    const onAuctionBid = useCallback(async (data: SocketAuctionBidEntity) => {
        if (!user) return;

        const cachedUser = data.bidderId !== user.id ? await addCachedUser(data.bidderId) : user;
        const blook = data?.blook?.blookId
            ? blooks.find((b) => b.id === data?.blook?.blookId)
            : null;
        const item = data.item
            ? items.find((i) => i.id === data?.item?.itemId)
            : null;

        if (data.sellerId === user.id) {
            createToast({
                header: "Auction Bid",
                body: `${cachedUser.username} bid ${data.amount} token(s) on your ${data.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}.`,
                icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId),
                onClick: () => navigate(`/auction-house?id=${data.auctionId}`)
            });
        }

        if (data.bidderId !== user.id && data.bidders.includes(user.id)) {
            createToast({
                header: "Auction Outbid",
                body: `${cachedUser.username} outbid you by ${data.amount} token(s).`,
                icon: resourceIdToPath(data.type === AuctionTypeEnum.BLOOK ? blook!.imageId : item!.imageId),
                onClick: () => navigate(`/auction-house?id=${data.auctionId}`)
            });
        }

        setAuctions((prev) =>
            prev.map((auction) =>
                auction.id === data.auctionId
                    ? {
                        ...auction,
                        bids: [
                            {
                                id: data.id,
                                amount: data.amount,
                                user: cachedUser,
                                userId: cachedUser.id,
                                auctionId: auction.id,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            },
                            ...auction.bids
                        ]
                    }
                    : auction
            )
        );
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

    return {
        loading,
        setLoading,
        auctions,
        setAuctions,
        search,
        setSearch,
        getAuctions
    };
}
