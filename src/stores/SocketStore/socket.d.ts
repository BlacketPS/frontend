import { Socket } from "socket.io-client";

export interface SocketStoreContext {
    socket: Socket | null,
    connected: boolean,
    initializeSocket: () => void
}
