import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import styles from "./tooManyConnections.module.scss";

import { type SocketStoreContext } from "./socket.d";

const SocketStoreContext = createContext<SocketStoreContext>({
    socket: null,
    connected: false,
    initializeSocket: () => { }
});

export function useSocket() {
    return useContext(SocketStoreContext);
}

export function SocketStoreProvider({ children }: { children: ReactNode }) {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [tooManyConnections, setTooManyConnections] = useState<boolean>(false);

    const initializeSocket = useCallback(() => {
        setConnected(false);

        const socket = io(`${window.location.protocol}//${window.location.host}`, { path: "/gateway", auth: { token: localStorage.getItem("token") }, transports: ["websocket"] });

        socket.on("connect", () => {
            setConnected(true);

            console.info("[Blacket] Connected to WebSocket server.");
        });

        socket.on("disconnect", () => {
            setConnected(false);

            console.info("[Blacket] Disconnected from WebSocket server.");

            if (localStorage.getItem("token")) {
                console.info("[Blacket] Reconnecting to WebSocket server...");

                initializeSocket();
            }
        });

        socket.on("too-many-connections", () => {
            console.warn("[Blacket] Too many connections, closing WebSocket connection...");

            setTooManyConnections(true);

            socket.close();
        });

        socket.onAny((event: string, data: object) => {
            if (import.meta.env.MODE === "development") console.log({ event, data });
        });

        if (import.meta.env.MODE === "development") window.socket = socket;

        socketRef.current = socket;

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        initializeSocket();

        return () => {
            socketRef.current?.close();

            socketRef.current = null;
        };
    }, [initializeSocket]);

    return (
        <SocketStoreContext.Provider value={{ socket: socketRef.current, connected, initializeSocket }}>
            {!tooManyConnections ? children : <h1 className={styles.tooManyConnections}>You have too many connections open, please close some tabs or disconnect some devices and try again.</h1>}
        </SocketStoreContext.Provider>
    );
}
