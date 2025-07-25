import { create } from "zustand";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "@stores/SocketStore";
import { useUser } from "@stores/UserStore";
import { useCachedUser } from "@stores/CachedUserStore";
import { useSound } from "@stores/SoundStore";
import { useMessages } from "@controllers/chat/messages/useMessages";
import { useStartTyping } from "@controllers/chat/messages/roomId/useStartTyping";
import { useSendMessage } from "@controllers/chat/messages/useSendMessage";
import { useToast } from "@stores/ToastStore";

import { ClientMessage, TypingUser, ChatStore } from "./chatStore.d";
import { Message, NotFound, PermissionTypeEnum, SocketMessageType } from "@blacket/types";

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    usersTyping: [],
    replyingTo: null,
    editing: null,
    mentions: 0,
    room: 0,

    setReplyingTo: (message) => set({ replyingTo: message }),
    setEditing: (message) => set({ editing: message }),
    setRoom: (room) => set({ room }),
    resetMentions: () => set({ mentions: 0 }),

    fetchMessages: () => { },
    sendMessage: () => { },
    startTyping: () => { },

    _typingTimeout: null
}));

export function useChat() {
    const {
        messages, usersTyping, replyingTo, editing,
        mentions, room,
        setReplyingTo, setEditing,
        resetMentions, setRoom,
        _typingTimeout
    } = useChatStore.getState();

    const { connected, socket } = useSocket();
    const { user, getUserAvatarPath } = useUser();
    const { addCachedUser } = useCachedUser();
    const { createToast } = useToast();
    const { getMessages } = useMessages();
    const { playSound, defineSounds } = useSound();

    const location = useLocation();
    const navigate = useNavigate();

    const locationRef = useRef(location);
    locationRef.current = location;

    const usersTypingRef = useRef(usersTyping);
    usersTypingRef.current = usersTyping;

    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const fetchMessages = async (roomOverride?: number): Promise<ClientMessage[]> => {
        const r = roomOverride ?? room;

        if (!user) return [];

        const messages = await getMessages(r, 50).then((res) => res.data).catch(() => []);
        const userMap = new Map<string, boolean>();

        messages.forEach((m: Message) => userMap.set(m.authorId, true));

        await Promise.all(Array.from(userMap.keys()).map((uid) => addCachedUser(uid)));

        useChatStore.setState({ messages });

        return messages;
    };

    const sendMessage = async (content: string) => {
        if (!user) throw new Error(NotFound.UNKNOWN_USER);

        const nonce = `${Math.floor(Date.now() / 1000)}${Math.floor(1000000 + Math.random() * 9000000)}`;
        const now = new Date();
        const message: ClientMessage = {
            id: nonce,
            roomId: room,
            authorId: user.id,
            author: user,
            content,
            mentions: [],
            replyingToId: replyingTo?.id ?? null,
            replyingTo: replyingTo ?? undefined,
            createdAt: now,
            updatedAt: now,
            discordMessageId: null,
            deletedAt: null,
            editedAt: null,
            nonce
        };

        const previousMessages = messages;
        useChatStore.setState({ messages: [message, ...previousMessages], replyingTo: null });

        useSendMessage().sendMessage(room, {
            content,
            replyingTo: replyingTo?.id
        }).then((res) => {
            useChatStore.setState({
                messages: messages.map((m) => (m.nonce === nonce ? res.data : m))
            });
        }).catch((err) => {
            message.error = err?.data?.message || "Something went wrong.";

            useChatStore.setState({
                messages: messages.map((m) => (m.nonce === nonce ? message : m))
            });
        });
    };

    const startTyping = () => {
        const now = Date.now();

        const typingTimeout = _typingTimeout;
        if (typingTimeout && now - typingTimeout < 2000) return;

        useChatStore.setState({ _typingTimeout: now });
        useStartTyping().startTyping(0);
    };

    const parseContent = async (content: string): Promise<string> => {
        const matches = [...content.matchAll(/<@(\d+)>/g)];
        if (matches.length === 0) return content;

        const replacements = await Promise.all(
            matches.map(async (match) => {
                const userId = match[1];
                const cachedUser = await addCachedUser(userId);

                return {
                    original: match[0],
                    replacement: cachedUser ? `@${cachedUser.username}` : `<@${userId}>`
                };
            })
        );

        let result = content;
        for (const { original, replacement } of replacements) result = result.replace(original, replacement);
        return result;
    };

    const addMention = async (message: ClientMessage) => {
        if (!user) return;

        const l = locationRef.current.pathname.split("/")[1];
        if (l === "chat") return;

        const cachedUser = await addCachedUser(message.authorId);

        if (message.mentions.includes(user.id) || message.replyingTo?.authorId === user.id) {
            playSound("mention");
            useChatStore.setState((s) => ({ mentions: s.mentions + 1 }));
            createToast({
                header: cachedUser.username,
                body: await parseContent(message.content),
                icon: getUserAvatarPath(cachedUser),
                onClick: () => {
                    navigate("/chat");
                    setReplyingTo(message);
                }
            });
        }
    };

    useEffect(() => {
        if (!connected || !user || !socket) return;

        defineSounds([{ id: "mention", url: window.constructCDNUrl("/content/audio/sound/mention.mp3") }]);

        fetchMessages(room);

        const onChatMessageCreate = async (data: ClientMessage) => {
            if (!user || data.authorId === user.id) return;

            addMention(data);

            useChatStore.setState((s) => ({
                messages: [data, ...s.messages],
                usersTyping: s.usersTyping.filter((u) => u.userId !== data.authorId)
            }));
        };

        const onChatMessageUpdate = (data: ClientMessage) => {
            if (!user) return;

            const prev = messagesRef.current.find((m) => m.id === data.id);
            if (!prev) return;

            const newMessage = { ...prev, content: data.content, edited: true };
            const messagesReplying = messagesRef.current.filter((m) => m.replyingTo?.id === data.id);

            useChatStore.setState((s) => ({
                messages: s.messages.map((m) => {
                    if (m.id === data.id) return newMessage;
                    if (messagesReplying.find((mr) => mr.id === m.id)) {
                        return {
                            ...m,
                            replyingTo: { ...m.replyingTo!, content: data.content }
                        };
                    }
                    return m;
                })
            }));
        };

        const onChatMessagesDelete = ({ messageId }: { messageId: string }) => {
            if (!user) return;

            useChatStore.setState((s) => ({
                messages: user.hasPermission(PermissionTypeEnum.MANAGE_MESSAGES)
                    ? s.messages.map((m) => m.id === messageId ? { ...m, deleted: true } : m)
                    : s.messages.filter((m) => m.id !== messageId)
            }));
        };

        const onChatStartTyping = (data: TypingUser) => {
            if (!user || data.userId === user.id) return;

            addCachedUser(data.userId);

            data.startedTypingAt = Date.now();

            useChatStore.setState((s) => {
                if (s.usersTyping.find((u) => u.userId === data.userId)) return s;
                return { usersTyping: [...s.usersTyping, data] };
            });
        };

        const tick = () => {
            const now = Date.now();

            useChatStore.setState((s) => ({
                usersTyping: s.usersTyping.filter((u) => now - u.startedTypingAt < 2500)
            }));

            setTimeout(tick, 1000);
        };

        tick();

        socket.on(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
        socket.on(SocketMessageType.CHAT_MESSAGES_UPDATE, onChatMessageUpdate);
        socket.on(SocketMessageType.CHAT_MESSAGES_DELETE, onChatMessagesDelete);
        socket.on(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);

        return () => {
            socket.off(SocketMessageType.CHAT_MESSAGES_CREATE, onChatMessageCreate);
            socket.off(SocketMessageType.CHAT_MESSAGES_UPDATE, onChatMessageUpdate);
            socket.off(SocketMessageType.CHAT_MESSAGES_DELETE, onChatMessagesDelete);
            socket.off(SocketMessageType.CHAT_TYPING_STARTED, onChatStartTyping);
        };
    }, [connected]);

    return {
        messages,
        usersTyping,
        replyingTo,
        editing,
        fetchMessages,
        sendMessage,
        startTyping,
        mentions,
        resetMentions,
        room,
        setRoom,
        setReplyingTo,
        setEditing
    };
}
