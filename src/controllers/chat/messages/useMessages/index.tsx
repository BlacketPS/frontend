import { MessagesResponse } from "./useMessages.d";

export function useMessages() {
    const getMessages = (room: number, limit: number) => new Promise<MessagesResponse>((resolve, reject) => window.fetch2.get(`/api/chat/messages/${room}?limit=${limit}`)
        .then((res: MessagesResponse) => {
            resolve(res);
        })
        .catch(reject));

    return { getMessages };
}
