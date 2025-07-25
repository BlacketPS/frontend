import { CSSProperties, ReactNode } from "react";

export interface ContextMenuStore {
    contextMenu: ContextMenu | null;
    setContextMenu: (contextMenu: ContextMenu) => void;
    openContextMenu: (items: ContextMenu["items"]) => void;
    closeContextMenu: () => void;
    visible: boolean;
    setVisible: (v: boolean) => void;
    contextMenuRef: React.RefObject<HTMLDivElement>;
    render: () => JSX.Element | null;
    cursorPosition?: { x: number; y: number };
}

export interface ContextMenuItem {
    divider?: boolean;
    icon?: string;
    image?: string;
    color?: string;
    onClick?: () => void;
    label?: string;
}

export interface ContextMenu {
    items: Array<ContextMenuItem | null | undefined>;
    x?: number;
    y?: number;
}

export interface ContainerProps {
    visible: boolean;
    top: CSSProperties["top"];
    left: CSSProperties["left"];
    children: ReactNode;
}

export interface ItemProps {
    icon?: string;
    image?: string;
    color?: string;
    children: ReactNode;
    onClick: () => void;
}
