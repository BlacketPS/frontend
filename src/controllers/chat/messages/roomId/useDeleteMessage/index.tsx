export function useDeleteMessage() {
    const deleteMessage = (roomId: number, messageId: string) => new Promise<void>((resolve, reject) => window.fetch2.delete(`/api/chat/messages/${roomId}/${messageId}`, {})
        .then(() => resolve())
        .catch(reject));

    return { deleteMessage };
}
