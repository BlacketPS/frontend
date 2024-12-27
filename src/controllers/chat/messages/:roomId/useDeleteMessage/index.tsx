export function useDeleteMessage() {
    const deleteMessage = (room: number, messageId: string) => new Promise<void>((resolve, reject) => window.fetch2.delete(`/api/chat/messages/${room}/${messageId}`, {})
        .then(() => resolve())
        .catch(reject));

    return { deleteMessage };
}
