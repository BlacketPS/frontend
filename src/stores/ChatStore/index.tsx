import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { useSocket } from "@stores/SocketStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useMessages } from "@controllers/chat/messages/useMessages/index";
import { useStartTyping } from "@controllers/chat/messages/roomId/useStartTyping/index";
import { useSendMessage } from "@controllers/chat/messages/useSendMessage/index";
import { useToast } from "@stores/ToastStore/index";

import { ClientMessage, TypingUser, type ChatStoreContext } from "./chatStore.d";
import { Message, NotFound, PermissionTypeEnum, SocketMessageType } from "@blacket/types";

const ChatStoreContext = createContext<ChatStoreContext>({
    messages: [],
    usersTyping: [],
    replyingTo: null,
    setReplyingTo: () => { },
    editing: null,
    setEditing: () => { },
    fetchMessages: () => { },
    sendMessage: () => { },
    startTyping: () => { },
    mentions: 0,
    resetMentions: () => { },
    room: 0,
    setRoom: () => { }
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
    const [room, setRoom] = useState<number>(1);
    const [replyingTo, setReplyingTo] = useState<ClientMessage | null>(null);
    const [editing, setEditing] = useState<ClientMessage | null>(null);
    const [usersTyping, setUsersTyping] = useState<TypingUser[]>([]);
    const [mentions, setMentions] = useState(0);

    const usersTypingRef = useRef(usersTyping);
    usersTypingRef.current = usersTyping;

    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    let typingTimeout: number | null = null;

    const fetchMessages = async (r: number = room) => {
        if (!user) return [];

        const messages = await getMessages(r, 50)
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
    };

    const sendMessage = async (content: string) => {
        if (!user) throw new Error(NotFound.UNKNOWN_USER);

        const nonce = ((Math.floor(Date.now() / 1000).toString()) + Math.floor(1000000 + Math.random() * 9000000)).toString();
        const message: ClientMessage = {
            id: nonce,
            roomId: room,
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

        const previousMessages = messages;
        setMessages([message, ...previousMessages]);

        typingTimeout = null;
        setReplyingTo(null);

        useSendMessage().sendMessage(room, { content, replyingTo: replyingTo ? replyingTo.id : undefined })
            .then((res) => setMessages((previousMessages) => previousMessages.map((message) => message.nonce === nonce ? res.data : message)))
            .catch((err) => {
                message.error = err.data.message || "Something went wrong.";

                setMessages((previousMessages) => previousMessages.map((message) => message.nonce === nonce ? message : message));
            });
    };

    const startTyping = () => {
        if (typingTimeout && Date.now() - typingTimeout < 2000) return;

        useStartTyping().startTyping(0);

        typingTimeout = Date.now();
    };

    const resetMentions = () => setMentions(0);

    const onChatMessageCreate = async (data: ClientMessage) => {
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
    };

    const onChatMessageUpdate = (data: ClientMessage) => {
        if (!user) return;

        const previousMessage = messagesRef.current.find((message) => message.id === data.id);
        if (!previousMessage) return;

        const newMessage = { ...previousMessage, content: data.content, edited: true };

        // edit other messages replies as well
        const messagesReplyingToThisMessage = messagesRef.current.filter((message) => message.replyingTo?.id === data.id);

        setMessages((previousMessages) => previousMessages.map((message) => {
            if (message.id === data.id) return newMessage;

            if (messagesReplyingToThisMessage.find((m) => m.id === message.id)) return { ...message, replyingTo: { ...(message.replyingTo as ClientMessage), content: data.content } };

            return message;
        }));
    };

    const onChatMessagesDelete = (data: { messageId: string }) => {
        if (!user) return;

        if (user.hasPermission(PermissionTypeEnum.MANAGE_MESSAGES)) return setMessages((previousMessages) => previousMessages.map((message) => message.id === data.messageId ? { ...message, deleted: true } : message));
        else setMessages((previousMessages) => previousMessages.filter((message) => message.id !== data.messageId));
    };

    const onChatStartTyping = (data: TypingUser) => {
        if (!user) return;

        if (data.userId === user.id) return;

        addCachedUser(data.userId);

        data.startedTypingAt = Date.now();

        setUsersTyping((previousUsersTyping) => {
            const user = previousUsersTyping.find((user) => user.userId === data.userId);
            if (user) return previousUsersTyping;

            return [...new Set([...previousUsersTyping, data])];
        });
    };

    const updateUsersTyping = () => {
        const newUsersTyping = usersTypingRef.current.filter((user) => Date.now() - user.startedTypingAt < 2500);

        if (newUsersTyping.length !== usersTypingRef.current.length) setUsersTyping(newUsersTyping);
    };

    useEffect(() => {
        if (!connected || !user || !socket) return;

        fetchMessages(room);

        socket.on(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
        socket.on(SocketMessageType.CHAT_MESSAGES_UPDATE, onChatMessageUpdate);
        socket.on(SocketMessageType.CHAT_MESSAGES_DELETE, onChatMessagesDelete);
        socket.on(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);

        let active = true;

        const tick = () => {
            if (!active) return;

            updateUsersTyping();

            setTimeout(tick, 1000);
        };

        tick();

        return () => {
            active = false;

            socket.off(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
            socket.off(SocketMessageType.CHAT_MESSAGES_UPDATE, onChatMessageUpdate);
            socket.off(SocketMessageType.CHAT_MESSAGES_DELETE, onChatMessagesDelete);
            socket.off(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);
        };
    }, [connected]);

    return <ChatStoreContext.Provider value={{
        messages, usersTyping, replyingTo, setReplyingTo, editing, setEditing,
        fetchMessages, sendMessage, startTyping, mentions, resetMentions,
        room, setRoom
    }}>{children}</ChatStoreContext.Provider>;
}
