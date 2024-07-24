import { Message } from "blacket-types";

export interface ChatStoreContext {
    messages: Message[];
    usersTyping: { userId: string, startedTypingAt: number }[];
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    fetchMessages: (room: number) => void;
    sendMessage: (content: string) => void;
    startTyping: () => void;
    mentions: number;
    resetMentions: () => void;
}

export interface TypingUser {
    userId: string;
    startedTypingAt: number;
}