import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useUser } from "@stores/UserStore";

import { type SocketStoreContext } from "./socket.d";
import { PrivateUser, SocketMessageType } from "@blacket/types";

const SocketStoreContext = createContext<SocketStoreContext>({
    socket: null,
    connected: false,
    latency: 0,
    initializeSocket: () => { }
});

export function useSocket() {
    return useContext(SocketStoreContext);
}

export function SocketStoreProvider({ children }: { children: ReactNode }) {
    const { user, setUser } = useUser();

    const [connected, setConnected] = useState<boolean>(false);
    const [latency, setLatency] = useState<number>(0);

    const socketRef = useRef<Socket | null>(null);
    const last10Latency = useRef<number[]>([]);
    const userRef = useRef<PrivateUser | null>(user);

    const navigate = useNavigate();

    const initializeSocket = useCallback(() => {
        setConnected(false);

        const socket = io(`${window.location.protocol}//${window.location.host}`, { path: "/gateway", auth: { token: localStorage.getItem("token") }, transports: ["websocket"] });

        let pinging = true;

        const pingLoop = () => {
            if (!pinging || !socket.connected) return;

            const start = Date.now();

            socket.emit(SocketMessageType.PING);
            socket.once(SocketMessageType.PONG, () => {
                if (!pinging || !socket.connected) return;

                socket.emit(SocketMessageType.PONG);
                const currentPing = Date.now() - start;

                last10Latency.current.push(currentPing);
                if (last10Latency.current.length > 10) last10Latency.current.shift();

                const averageLatency = last10Latency.current.length < 10 ? Math.min(...last10Latency.current) : last10Latency.current.reduce((a, b) => a + b, 0) / last10Latency.current.length;

                setLatency(Number(averageLatency.toFixed(0)));

                setTimeout(pingLoop, 1000);
            });
        };

        socket.on("connect", () => {
            setConnected(true);

            pingLoop();

            console.info("[Blacket] Connected to WebSocket server.");
        });

        socket.on("disconnect", () => {
            setConnected(false);

            console.info("[Blacket] Disconnected from WebSocket server.");

            if (localStorage.getItem("token")) {
                console.info("[Blacket] Reconnecting to WebSocket server...");

                initializeSocket();
            }

            pinging = false;
        });

        socket.on(SocketMessageType.PURCHASE_SUCCEEDED, (data: any) => {
            if (!userRef.current) return;

            const newUser = {
                ...userRef.current,

                blooks: [
                    ...userRef.current.blooks,
                    ...(data.blooks || [])
                ],
                items: [
                    ...userRef.current.items,
                    ...(data.items || [])
                ],
                fonts: [
                    ...userRef.current.fonts,
                    ...(data.fonts || [])
                ],
                titles: [
                    ...userRef.current.titles,
                    ...(data.titles || [])
                ],
                banners: [
                    ...userRef.current.banners,
                    ...(data.banners || [])
                ],
                permissions: [
                    ...userRef.current.permissions,
                    ...(data.permissions || [])
                ],

                gems: userRef.current.gems + (data.gems ?? 0),
                tokens: userRef.current.tokens + (data.tokens ?? 0),

                subscription: data.subscription || userRef.current.subscription
            };

            setUser(newUser);

            navigate("/settings/billing");
        });

        socket.onAny((event: string, data: object) => {
            if (import.meta.env.MODE === "development") console.log({ event, data });
        });

        if (import.meta.env.MODE === "development") window.socket = socket;

        socketRef.current = socket;

        return () => {
            pinging = false;

            socket.close();
        };
    }, []);

    useEffect(() => {
        initializeSocket();

        return () => {
            socketRef.current?.offAny();
            socketRef.current?.close();

            socketRef.current = null;
        };
    }, [initializeSocket]);

    useEffect(() => {
        if (!user) return;

        userRef.current = user;
    }, [user]);

    return (
        <SocketStoreContext.Provider value={{
            socket: socketRef.current,
            connected, latency,
            initializeSocket
        }}>
            {children}
        </SocketStoreContext.Provider>
    );
}
