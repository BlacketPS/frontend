import { Message } from "@blacket/types";

type Response = Fetch2Response & { data: Message[] };

export function useMessages() {
    const getMessages = (roomId: number, limit: number) => new Promise<Response>((resolve, reject) => window.fetch2.get(`/api/chat/messages/${roomId}?limit=${limit}`)
        .then((res: Response) => {
            resolve(res);
        })
        .catch(reject));

    return { getMessages };
}
