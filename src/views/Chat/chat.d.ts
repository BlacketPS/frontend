import { HTMLAttributes, ReactNode } from "react";
import { ClientMessage } from "@stores/ChatStore/chatStore";
import { PublicUser } from "@blacket/types";

export enum ElementType {
    MENTION = "mention"
}

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

export interface MarkdownEditorProps extends HTMLAttributes<HTMLDivElement> {
    content?: ReactNode;
    color?: string;
    readOnly?: boolean;
    getEditor?: (editor: any) => void;
}

export interface ElementProps {
    attributes: any;
    children: any;
    element: any;
}

export interface MentionElementProps extends ElementProps {
    element: {
        user: PublicUser;
    }
}

export interface LeafContent {
    text: string;
    color?: string;
}

export interface Leaf {
    text: string;
    content?: LeafContent;

    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underlined?: boolean;

    link?: boolean;
    mention?: boolean;

    color?: string;
}

export interface LeafProps {
    attributes: any;
    children: any;
    leaf: Leaf;
    readOnly: boolean;
}

export interface InputContainerProps {
    placeholder: string;
    maxLength: number;
}
