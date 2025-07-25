export interface ToastStore {
    toasts: Toast[];
    createToast: (toast: Toast) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
    closeToast: (id: string) => void;
    setToasts: (toasts: Toast[]) => void;
}

export interface Toast {
    id?: string;
    header: string;
    body: string;
    icon?: string;
    expires?: number;
    onClick?: () => void;

    aboutToClose?: boolean;
    closing?: boolean;
}
