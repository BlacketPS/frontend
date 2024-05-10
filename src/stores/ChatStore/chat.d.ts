import { Message, User } from "blacket-types";

export interface ChatStoreContext {
    messages: Message[];
    cachedUsers: User[];
    usersTyping: { userId: string, startedTypingAt: number }[];
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    fetchMessages: (room: number) => void;
    sendMessage: (content: string) => void;
    startTyping: () => void;
}

export interface UserTyping {
    userId: string;
    startedTypingAt: number;
}
