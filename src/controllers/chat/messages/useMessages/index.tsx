import { Message } from "@blacket/types";

export function useMessages() {
    const getMessages = (room: number, limit: number) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.get(`/api/chat/messages/${room}?limit=${limit}`)
        .then((res: Fetch2Response & { data: Message[] }) => {
            resolve(res);
        })
        .catch(reject));

    return { getMessages };
}
