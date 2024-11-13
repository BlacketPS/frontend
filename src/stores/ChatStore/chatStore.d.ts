import { Message } from "@blacket/types";

export interface ClientMessage extends Message {
    nonce: string;
}

export interface TypingUser {
    userId: string;
    startedTypingAt: number;
}

export interface ChatStoreContext {
    messages: ClientMessage[];
    usersTyping: TypingUser[];
    replyingTo: ClientMessage | null;
    setReplyingTo: (message: ClientMessage | null) => void;
    fetchMessages: (room: number) => void;
    sendMessage: (content: string) => void;
    startTyping: () => void;
    mentions: number;
    resetMentions: () => void;
}
