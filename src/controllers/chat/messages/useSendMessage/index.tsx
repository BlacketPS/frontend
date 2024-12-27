import { ChatCreateMessageDto, Message } from "@blacket/types";

type Response = Fetch2Response & { data: Message };

export function useSendMessage() {
    const sendMessage = (roomId: number, dto: ChatCreateMessageDto) => new Promise<Response>((resolve, reject) => window.fetch2.post(`/api/chat/messages/${roomId}`, dto)
        .then((res: Response) => resolve(res))
        .catch(reject));

    return { sendMessage };
}
