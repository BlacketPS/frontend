import { HTMLAttributes, ReactNode } from "react";
import { ClientMessage, UserTyping } from "@stores/ChatStore/chatStore";

export interface ChatMessagesContainerProps extends HTMLAttributes<HTMLUListElement> {
    aboveInput: boolean;
}

export interface ChatMessageProps {
    message: ClientMessage;
    newUser: boolean;
    mentionsMe: boolean;
    isSending: boolean;
    isEditing: boolean;
    messageContextMenu?: (e) => void;
    userContextMenu?: (e) => void;
    onEditSave?: (content: string) => void;
    onEditCancel?: () => void;
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
