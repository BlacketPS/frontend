
import { Message, PublicUser } from "@blacket/types";

export interface ClientMessage extends Message {
    author: PublicUser;
    replyingTo?: ClientMessage | null;
    nonce?: string;
    error?: string;
}

export interface TypingUser {
    userId: string;
    startedTypingAt: number;
}

export interface ChatStore {
    messages: ClientMessage[];
    usersTyping: TypingUser[];
    replyingTo: ClientMessage | null;
    setReplyingTo: (message: ClientMessage | null) => void;
    editing: ClientMessage | null;
    setEditing: (message: ClientMessage | null) => void;
    fetchMessages: (roomOverride?: number) => void;
    sendMessage: (content: string) => void;
    startTyping: () => void;
    mentions: number;
    resetMentions: () => void;
    room: number;
    setRoom: (room: number) => void;
    _typingTimeout: number | null;
}
