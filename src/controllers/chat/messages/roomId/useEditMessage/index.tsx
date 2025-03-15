import { ChatEditMessageDto } from "@blacket/types";

type Response = Fetch2Response & { data: void };

export function useEditMessage() {
    const editMessage = (roomId: number, messageId: string, dto: ChatEditMessageDto) => new Promise<Response>((resolve, reject) => window.fetch2.put(`/api/chat/messages/${roomId}/${messageId}`, dto)
        .then((res: Response) => resolve(res))
        .catch(reject));

    return { editMessage };
}
