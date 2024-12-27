import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useSocket } from "@stores/SocketStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useMessages } from "@controllers/chat/messages/useMessages/index";
import { useStartTyping } from "@controllers/chat/messages/:roomId/useStartTyping/index";
import { useSendMessage } from "@controllers/chat/messages/useSendMessage/index";
import { useToast } from "@stores/ToastStore/index";

import { ClientMessage, TypingUser, type ChatStoreContext } from "./chatStore.d";
import { Message, NotFound, PermissionTypeEnum, SocketMessageType } from "@blacket/types";

const ChatStoreContext = createContext<ChatStoreContext>({
    messages: [],
    usersTyping: [],
    replyingTo: null,
    setReplyingTo: () => { },
    fetchMessages: () => { },
    sendMessage: () => { },
    startTyping: () => { },
    mentions: 0,
    resetMentions: () => { }
});

export function useChat() {
    return useContext(ChatStoreContext);
}

export function ChatStoreProvider({ children }: { children: ReactNode }) {
    const { connected, socket } = useSocket();
    const { user, getUserAvatarPath } = useUser();
    const { addCachedUser } = useCachedUser();
    const { createToast } = useToast();

    const { getMessages } = useMessages();

    const [messages, setMessages] = useState<ClientMessage[]>([]);
    const [replyingTo, setReplyingTo] = useState<ClientMessage | null>(null);
    const [usersTyping, setUsersTyping] = useState<TypingUser[]>([]);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const [mentions, setMentions] = useState(0);

    const fetchMessages = useCallback(async (room: number) => {
        if (!user) return [];

        const messages = await getMessages(room, 50)
            .then((res) => res.data)
            .catch(() => []);

        const userMap = new Map<string, boolean>();
        messages.forEach((message: Message) => {
            userMap.set(message.authorId, true);
            if (message.mentions.includes(user.id)
                || (message.replyingTo && message.replyingTo.authorId === user.id)) setMentions((previousMentions) => previousMentions + 1);
        });

        await Promise.all(Array.from(userMap.keys()).map((user) => addCachedUser(user)));

        setMessages(messages);

        return messages;
    }, [user]);

    const sendMessage = useCallback(async (content: string) => {
        if (!user) throw new Error(NotFound.UNKNOWN_USER);

        const nonce = ((Math.floor(Date.now() / 1000).toString()) + Math.floor(1000000 + Math.random() * 9000000)).toString();
        const message: ClientMessage = {
            id: nonce,
            roomId: 0,
            authorId: user.id,
            author: user,
            content,
            mentions: [],
            replyingToId: replyingTo ? replyingTo.id : null,
            replyingTo: replyingTo || undefined,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            discordMessageId: null,
            deleted: false,
            edited: false,
            nonce
        };

        setMessages((previousMessages) => [message, ...previousMessages]);

        setTypingTimeout(null);
        setReplyingTo(null);

        useSendMessage().sendMessage(0, { content, replyingTo: replyingTo ? replyingTo.id : undefined })
            .then((res) => setMessages((previousMessages) => previousMessages.map((message) => message.nonce === nonce ? res.data : message)))
            .catch(() => { });
    }, [user, replyingTo]);

    const startTyping = () => {
        if (typingTimeout && Date.now() - typingTimeout < 2000) return;

        useStartTyping().startTyping(0);

        setTypingTimeout(Date.now());
    };

    const resetMentions = () => setMentions(0);

    const onChatMessageCreate = useCallback(async (data: ClientMessage) => {
        if (!user) return;

        if (data.authorId === user.id) return;

        const cachedUser = await addCachedUser(data.authorId);

        if (data.mentions.includes(user.id)
            || (data.replyingTo && data.replyingTo.authorId === user.id)) {
            new Audio(window.constructCDNUrl("/content/mention.ogg")).play();
            setMentions((previousMentions) => previousMentions + 1);

            createToast({
                header: cachedUser.username,
                body: data.content,
                icon: getUserAvatarPath(cachedUser)
            });
        }

        setMessages((previousMessages) => [data, ...previousMessages]);
        setUsersTyping((previousUsersTyping) => previousUsersTyping.filter((user) => user.userId !== data.authorId));
    }, [user]);

    const onChatMessagesDelete = useCallback((data: { messageId: string }) => {
        if (!user) return;

        if (user.hasPermission(PermissionTypeEnum.MANAGE_MESSAGES)) return setMessages((previousMessages) => previousMessages.map((message) => message.id === data.messageId ? { ...message, deleted: true } : message));
        else setMessages((previousMessages) => previousMessages.filter((message) => message.id !== data.messageId));
    }, []);

    const onChatStartTyping = useCallback((data: TypingUser) => {
        if (!user) return;

        if (data.userId === user.id) return;

        addCachedUser(data.userId);

        data.startedTypingAt = Date.now();

        setUsersTyping((previousUsersTyping) => {
            const user = previousUsersTyping.find((user) => user.userId === data.userId);
            if (user) return previousUsersTyping;

            return [...new Set([...previousUsersTyping, data])];
        });
    }, [user]);

    useEffect(() => {
        if (!connected || !user || !socket) return;

        fetchMessages(0);

        socket.on(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
        socket.on(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);
        socket.on(SocketMessageType.CHAT_MESSAGES_DELETE, onChatMessagesDelete);

        const typingInterval = setInterval(() => setUsersTyping((previousUsersTyping) => previousUsersTyping.filter((user) => Date.now() - user.startedTypingAt < 2500)), 1000);

        return () => {
            socket.off(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
            socket.off(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);
            socket.off(SocketMessageType.CHAT_MESSAGES_DELETE, onChatMessagesDelete);

            clearInterval(typingInterval);
        };
    }, [connected]);

    return <ChatStoreContext.Provider value={{
        messages, usersTyping, replyingTo, setReplyingTo,
        fetchMessages, sendMessage, startTyping, mentions, resetMentions
    }}>{children}</ChatStoreContext.Provider>;
}
