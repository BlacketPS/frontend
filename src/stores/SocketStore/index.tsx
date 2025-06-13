import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

import { type SocketStoreContext } from "./socket.d";
import { SocketMessageType } from "@blacket/types";

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
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [latency, setLatency] = useState<number>(0);

    const last10Latency = useRef<number[]>([]);

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
