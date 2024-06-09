import { HTMLAttributes, ReactNode } from "react";
import { UserTyping } from "@stores/ChatStore/chat.d";

import { Message, User } from "blacket-types";
import { Editor } from "slate";

export interface ChatMessagesContainerProps extends HTMLAttributes<HTMLUListElement> {
    aboveInput: boolean;
}

export interface ChatMessageProps {
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
}

export interface AreYouSureLinkModalProps {
    link: string;
}

export interface MarkdownPreviewProps {
    content?: ReactNode;
    color?: string;
    onLeafChange?: (editor: any) => void;
    readOnly?: boolean;
    [key: string]: any;
}

export interface LeafProps {
    attributes: any;
    children: any;
    leaf: any;
}

export interface BlacketEditor extends Editor {
    clearContent: () => void;
}

export interface InputContainerProps {
    placeholder: string;
    maxLength: number;
}

export interface UsersTypingProps {
    usersTyping: UserTyping[];
}
