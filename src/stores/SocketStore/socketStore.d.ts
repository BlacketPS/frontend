import { Socket } from "socket.io-client";

export interface SocketStore {
    socket: Socket | null;
    connected: boolean;
    latency: number;
    initializeSocket: () => void;
}
