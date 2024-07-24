import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useSocket } from "@stores/SocketStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useMessages } from "@controllers/chat/messages/useMessages/index";

import { TypingUser, type ChatStoreContext } from "./chatStore.d";
import { Message, PublicUser, SocketMessageType } from "blacket-types";

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
    const { user } = useUser();
    const { addCachedUser } = useCachedUser();

    const { getMessages } = useMessages();

    const [messages, setMessages] = useState<Message[]>([]);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [usersTyping, setUsersTyping] = useState<TypingUser[]>([]);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const [mentions, setMentions] = useState(0);

    const fetchMessages = async (room: number) => {
        const messages = await getMessages(room, 50)
            .then((res) => res.data)
            .catch(() => []);

        const userMap = new Map<string, boolean>();
        messages.forEach((message) => {
            userMap.set(message.authorId, true);
            if (message.mentions.includes(user?.id)
                || (message.replyingTo && message.replyingTo.authorId === user?.id)) setMentions((previousMentions) => previousMentions + 1);
        });

        for (const user of Array.from(userMap.keys())) addCachedUser(user);

        setMessages(messages);

        return messages;
    };

    const sendMessage = async (content: string) => {
        const nonce = ((Math.floor(Date.now() / 1000).toString()) + Math.floor(1000000 + Math.random() * 9000000)).toString();

        setMessages((previousMessages: any) => [{ id: nonce, authorId: user?.id, content, mentions: [], replyingTo, createdAt: new Date(Date.now()).toISOString(), nonce }, ...previousMessages]);
        setTypingTimeout(null);
        setReplyingTo(null);

        await window.fetch2.post("/api/chat/messages/0", { content, replyingTo: replyingTo ? replyingTo.id : null })
            .then((res) => setMessages((previousMessages: any) => previousMessages.map((message: any) => message.nonce === nonce ? { ...message, id: res.data.id, mentions: res.data.mentions, nonce: undefined } : message)))
            .catch(() => { });
    };

    /* const sendMessage = (content: string) => {
        const nonce = ((Math.floor(Date.now() / 1000).toString()) + Math.floor(1000000 + Math.random() * 9000000)).toString();

        setMessages(previousMessages => [{ id: nonce, author: user, content, mentions: [], replyingTo, createdAt: new Date(Date.now()).toISOString(), nonce }, ...previousMessages]);

        socket.emit("messages-send", { content, replyingTo: replyingTo ? parseInt(replyingTo.id) : null, nonce });

        setTypingTimeout(null);
        setReplyingTo(null);
    } */

    const startTyping = () => {
        if (typingTimeout && Date.now() - typingTimeout < 2000) return;

        window.fetch2.post("/api/chat/messages/0/start-typing", {});

        setTypingTimeout(Date.now());
    };

    const resetMentions = () => setMentions(0);

    const onChatMessageCreate = useCallback((data: Message) => {
        if (!user) return;

        if (data.mentions.includes(user.id)
            || (data.replyingTo && data.replyingTo.authorId === user?.id)) {
            new Audio(import.meta.env.VITE_CDN_URL + "/content/mention.ogg").play();
            setMentions((previousMentions) => previousMentions + 1);
        }

        if (data.authorId === user?.id) return;

        addCachedUser(data.authorId);

        setMessages((previousMessages) => [data, ...previousMessages]);
        setUsersTyping((previousUsersTyping) => previousUsersTyping.filter((user) => user.userId !== data.authorId));
    }, [user]);

    const onChatStartTyping = useCallback((data: TypingUser) => {
        if (!user) return;

        if (data.userId === user.id) return;

        addCachedUser(data.userId);

        data.startedTypingAt = Date.now();

        setUsersTyping((previousUsersTyping) => {
            if (previousUsersTyping.some((user) => user.userId === data.userId)) return previousUsersTyping.map((user) => user.userId === data.userId ? data : user);

            return [...previousUsersTyping, data];
        });
    }, [user]);

    useEffect(() => {
        if (!connected || !user || !socket) return;

        fetchMessages(0);

        socket.on(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);

        socket.on(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);

        const typingInterval = setInterval(() => setUsersTyping((previousUsersTyping) => previousUsersTyping.filter((user) => Date.now() - user.startedTypingAt < 2500)), 1000);

        return () => {
            socket.off(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
            socket.off(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);

            clearInterval(typingInterval);
        };
    }, [connected]);

    return <ChatStoreContext.Provider value={{
        messages, usersTyping, replyingTo, setReplyingTo,
        fetchMessages, sendMessage, startTyping, mentions, resetMentions 
    }}>{children}</ChatStoreContext.Provider>;
}
