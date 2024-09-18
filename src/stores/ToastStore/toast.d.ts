export interface ToastStoreContext {
    toasts: Toast[],
    setToasts: (toasts: Toast[]) => void;
    createToast: (toast: Toast) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
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
