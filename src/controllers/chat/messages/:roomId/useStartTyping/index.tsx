export function useStartTyping() {
    const startTyping = (roomId: number) => new Promise<void>((resolve, reject) => window.fetch2.post(`/api/chat/messages/${roomId}/start-typing`, {})
        .then(() => resolve())
        .catch(reject));

    return { startTyping };
}
