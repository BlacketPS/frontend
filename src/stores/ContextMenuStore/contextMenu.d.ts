import { CSSProperties, ReactNode } from "react";

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

export interface ContextMenuContext {
    contextMenu: ContextMenu | null;
    setContextMenu: (contextMenu: ContextMenu) => void;
    openContextMenu: (items: ContextMenu["items"]) => void;
    closeContextMenu: () => void;
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
