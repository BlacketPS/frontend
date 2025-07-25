import { create } from "zustand";
import { io } from "socket.io-client";
import { SocketMessageType } from "@blacket/types";

import { SocketStore } from "./socketStore.d";

export const useSocket = create<SocketStore>((set, get) => ({
    socket: null,
    connected: false,
    latency: 0,

    initializeSocket: () => {
        const socket = io(`${location.protocol}//${location.host}`, {
            path: "/gateway",
            auth: { token: localStorage.getItem("token") },
            transports: ["websocket"]
        });

        let pinging = true;
        const last10Latency: number[] = [];

        socket.on("connect", () => {
            set({ connected: true });

            const sid = socket.id!;

            const pingLoop = () => {
                if (!pinging || socket.id !== sid) return;

                const start = Date.now();

                socket.emit(SocketMessageType.PING);
                socket.once(SocketMessageType.PONG, () => {
                    const latency = Date.now() - start;
                    last10Latency.push(latency);
                    if (last10Latency.length > 10) last10Latency.shift();

                    const average = last10Latency.length < 10
                        ? Math.min(...last10Latency)
                        : last10Latency.reduce((a, b) => a + b, 0) / last10Latency.length;

                    set({ latency: Math.round(average) });
                    setTimeout(pingLoop, 1000);
                });
            };

            pingLoop();

            console.info("[Blacket] Connected to WebSocket server.");
        });

        socket.on("disconnect", () => {
            set({ connected: false });

            console.info("[Blacket] Disconnected from WebSocket server.");

            if (localStorage.getItem("token")) {
                console.info("[Blacket] Reconnecting to WebSocket server...");

                setTimeout(() => {
                    get().initializeSocket();
                }, 1000);
            }

            pinging = false;
        });

        socket.onAny((event: string, data: object) => {
            if (import.meta.env.MODE === "development") console.log({ event, data });
        });

        if (import.meta.env.MODE === "development") window.socket = socket;

        set({ socket });
    }
}));
