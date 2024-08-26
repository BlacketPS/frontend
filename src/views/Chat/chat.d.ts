import { HTMLAttributes, ReactNode } from "react";
import { UserTyping } from "@stores/ChatStore/chatStore";

import { Message, User } from "blacket-types";
import { Editor } from "slate";

export interface ChatMessagesContainerProps extends HTMLAttributes<HTMLUListElement> {
    aboveInput: boolean;
}

/* export interface ChatMessageProps {
    id: number;
    author: User | null;
    newUser: boolean;
    createdAt: number;
    replyingTo: Message | null;
    replyingToAuthor: User | null;
    mentionsMe: boolean;
    isSending: boolean;
    rawMessage: Message;
    messageContextMenu: (e) => void;
    userContextMenu: (e) => void;
    children: ReactNode;
} */
export interface ChatMessageProps {
    message: Message;
    newUser: boolean;
    mentionsMe: boolean;
    isSending: boolean;
    messageContextMenu: (e) => void;
    userContextMenu: (e) => void;
}

export interface AreYouSureLinkModalProps {
    link: string;
}

export interface MarkdownPreviewProps {
    content?: ReactNode;
    color?: string;
    readOnly?: boolean;
    getEditor?: (editor: any) => void;
    [key: string]: any;
}

export interface ElementProps {
    attributes: any;
    children: any;
    element: any;
}

export interface InputContainerProps {
    placeholder: string;
    maxLength: number;
}

export interface UsersTypingProps {
    usersTyping: UserTyping[];
}
