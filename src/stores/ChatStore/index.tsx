import { create } from "zustand";

import { useUser } from "@stores/UserStore";
import { useCachedUser } from "@stores/CachedUserStore";
import { useMessages } from "@controllers/chat/messages/useMessages";
import { useStartTyping } from "@controllers/chat/messages/roomId/useStartTyping";
import { useSendMessage } from "@controllers/chat/messages/useSendMessage";

import { ClientMessage, ChatStore } from "./chatStore.d";

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    usersTyping: [],
    replyingTo: null,
    editing: null,
    mentions: 0,
    room: 0,

    setRoom: (room) => set({ room }),

    setReplyingTo: (message) => set({ replyingTo: message }),
    setEditing: (message) => set({ editing: message }),

    resetMentions: () => set({ mentions: 0 }),

    fetchMessages: () => { },
    sendMessage: () => { },
    startTyping: () => { },

    _typingTimeout: null
}));

export function useChat() {
    const chatStore = useChatStore();

    const { user } = useUser();
    const { addCachedUser } = useCachedUser();
    const { getMessages } = useMessages();

    const fetchMessages = async (roomOverride?: number): Promise<ClientMessage[]> => {
        if (!user) return [];

        const r = roomOverride ?? chatStore.room;
        const messages = await getMessages(r, 50).then((res) => res.data).catch(() => []);
        const userMap = new Map<string, boolean>();

        for (const m of messages) userMap.set(m.authorId, true);

        await Promise.all(Array.from(userMap.keys()).map((uid) => addCachedUser(uid)));

        useChatStore.setState({ messages });

        return messages;
    };

    const sendMessage = async (content: string) => {
        if (!user) return;

        const nonce = Date.now().toString(36);
        const now = new Date();

        const message: ClientMessage = {
            id: nonce,
            roomId: chatStore.room,
            authorId: user.id,
            author: user,
            content,
            color: user.settings.chatColor,
            mentions: [],
            replyingToId: chatStore.replyingTo?.id ?? null,
            replyingTo: chatStore.replyingTo ?? undefined,
            createdAt: now,
            updatedAt: now,
            discordMessageId: null,
            deletedAt: null,
            editedAt: null,
            nonce
        };

        useChatStore.setState((s) => ({
            messages: [message, ...s.messages],
            replyingTo: null
        }));

        useSendMessage()
            .sendMessage(chatStore.room, {
                content,
                nonce,
                replyingTo: chatStore.replyingTo?.id
            }).catch((err) => {
                message.error = err?.data?.message || "Something went wrong.";

                useChatStore.setState((s) => ({ messages: s.messages.map((m) => (m.nonce === nonce ? message : m)) }));
            });
    };

    const startTyping = () => {
        const now = Date.now();

        const typingTimeout = chatStore._typingTimeout;
        if (typingTimeout && now - typingTimeout < 2000) return;

        useChatStore.setState({ _typingTimeout: now });
        useStartTyping().startTyping(chatStore.room);
    };

    return {
        ...chatStore,
        fetchMessages,
        sendMessage,
        startTyping
    };
}
