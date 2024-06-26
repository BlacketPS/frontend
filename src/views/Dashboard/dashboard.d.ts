export interface TopButton {
    icon: string;
    text: string;
    link?: string;
    onClick?: () => void;
}

export interface LookupUserModalProps {
    onClick: (username: string) => Promise<void>;
}

export interface StatContainerProps {
    title: string;
    icon: string;
    value: string;
}
