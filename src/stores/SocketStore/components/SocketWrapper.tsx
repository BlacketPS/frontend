import { ReactNode, useEffect } from "react";
import { useUser } from "@stores/UserStore";
import { useSocket } from "@stores/SocketStore";
import { useNavigate } from "react-router-dom";
import { SocketMessageType } from "@blacket/types";

export function SocketWrapper({ children }: { children: ReactNode }) {
    const { user, setUser } = useUser();
    const { socket, initializeSocket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        initializeSocket();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const onPurchase = (data: any) => {
            if (!user) return;

            const newUser = {
                ...user,

                blooks: [
                    ...user.blooks,
                    ...(data.blooks || [])
                ],
                items: [
                    ...user.items,
                    ...(data.items || [])
                ],
                fonts: [
                    ...user.fonts,
                    ...(data.fonts || [])
                ],
                titles: [
                    ...user.titles,
                    ...(data.titles || [])
                ],
                banners: [
                    ...user.banners,
                    ...(data.banners || [])
                ],
                permissions: [
                    ...user.permissions,
                    ...(data.permissions || [])
                ],

                crystals: user.crystals + (data.crystals ?? 0),
                diamonds: user.diamonds + (data.diamonds ?? 0),
                tokens: user.tokens + (data.tokens ?? 0),

                subscription: data.subscription || user.subscription
            };

            setUser(newUser);

            navigate("/settings/billing");
        };

        socket.on(SocketMessageType.PURCHASE_SUCCEEDED, onPurchase);

        return () => {
            socket.off(SocketMessageType.PURCHASE_SUCCEEDED, onPurchase);
        };
    }, [socket, user]);

    return children;
}
