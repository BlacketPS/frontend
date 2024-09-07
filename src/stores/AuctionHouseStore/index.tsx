import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useSocket } from "@stores/SocketStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useSearchAuction } from "@controllers/auctions/useSearchAuction/index";

import { type AuctionHouseStoreContext } from "./auctionHouse.d";
import { AuctionsAuctionEntity, AuctionsSearchAuctionDto, AuctionTypeEnum, SocketMessageType } from "blacket-types";

const AuctionHouseStoreContext = createContext<AuctionHouseStoreContext>({
    loading: true,
    setLoading: () => { },
    auctions: [],
    setAuctions: () => { },
    search: {},
    setSearch: () => { }
});

export function useAuctionHouse() {
    return useContext(AuctionHouseStoreContext);
}

export function AuctionHouseStoreProvider({ children }: { children: ReactNode }) {
    const { connected, socket } = useSocket();
    const { user, setUser } = useUser();
    const { addCachedUser } = useCachedUser();

    const [loading, setLoading] = useState<boolean>(true);
    const [auctions, setAuctions] = useState<AuctionsAuctionEntity[]>([]);
    const [search, setSearch] = useState<AuctionsSearchAuctionDto>(JSON.parse(localStorage.getItem("AUCTION_SEARCH") || "{}"));

    const { searchAuction } = useSearchAuction();

    const onAuctionExpire = useCallback((data: AuctionsAuctionEntity) => {
        if (!user) return;

        if ((data.sellerId === user.id && !data.buyerId) || (data.buyerId === user.id && data.sellerId !== user.id)) switch (data.type) {
            case AuctionTypeEnum.BLOOK:
                if (!data.blookId) return;

                const userBlooks = user.blooks;

                (userBlooks[data.blookId] as number) += 1;

                setUser({ ...user, blooks: userBlooks });

                break;
            case AuctionTypeEnum.ITEM:
                if (!data.item) return;

                const userItems = user.items;

                userItems.push(data.item);

                setUser({ ...user, items: userItems });

                break;
        }

        setAuctions((previousAuctions) => previousAuctions.filter((auction) => auction.id !== data.id));
    }, [user]);

    const onAuctionBid = useCallback(async (data: { id: number, amount: number, userId: string }) => {
        if (!user) return;

        const cachedUser = data.userId !== user.id ? await addCachedUser(data.userId) : user;

        setAuctions((previousAuctions) => previousAuctions.map((previousAuction) => {
            if (previousAuction.id === data.id) return {
                ...previousAuction,
                bids: [
                    {
                        id: Math.random(),
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
        setLoading(true);

        searchAuction(search)
            .then((res) => {
                localStorage.setItem("AUCTION_SEARCH", JSON.stringify(search));

                setAuctions(res.data);

                setLoading(false);
            });
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
        search, setSearch
    }}>{children}</AuctionHouseStoreContext.Provider>;
}
