import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { ImageOrVideo } from "@components/index";
import { NotificationAccessModal } from "./components";
import styles from "./toast.module.scss";

import { Toast, type ToastStoreContext } from "./toast.d";

const ToastStoreContext = createContext<ToastStoreContext>({
    toasts: [],
    setToasts: () => { },
    createToast: () => { },
    removeToast: () => { },
    clearToasts: () => { }
});

export function useToast() {
    return useContext(ToastStoreContext);
}

export function ToastStoreProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const toastRef = useRef(toasts);

    const { createModal } = useModal();

    const createToast = (toast: Toast) => {
        const id = toast.id || Math.random().toString(36).substring(7);
        const expires = toast.expires || 5000;

        setToasts((prevToasts) => [...prevToasts, { ...toast, id, expires }]);
    };

    const removeToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const closeToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.map((toast) => toast.id === id ? { ...toast, closing: true } : toast));

        setTimeout(() => removeToast(id), 500);
    };

    const clearToasts = () => setToasts([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!toastRef.current[0]) return;
            if (toastRef.current[0].aboutToClose) return;

            new Audio(window.constructCDNUrl("/content/notification.ogg")).play();

            const toast = toastRef.current[0];

            try {
                if (!window.constants.APPLE_DEVICE) {
                    if (document.visibilityState === "hidden" && Notification.permission === "granted") {
                        const notification = new Notification(toast.header, { body: toast.body, icon: toast.icon, silent: true });

                        notification.addEventListener("click", () => {
                            if (toast.onClick) toast.onClick();
                            closeToast(toast.id!);
                        });
                    }
                }
            } catch (err) {
                console.warn("browser most likely doesn't support notifications");
            }

            setTimeout(() => closeToast(toast.id!), toast.expires);

            toastRef.current[0].aboutToClose = true;
        }, 100);

        try {
            if (!window.constants.APPLE_DEVICE) {
                if (Notification.permission !== "granted" && Notification.permission !== "denied") createModal(<NotificationAccessModal />);
            }
        } catch (err) {
            console.warn("browser most likely doesn't support notifications");
        }

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        toastRef.current = toasts;
    }, [toasts]);

    return (
        <ToastStoreContext.Provider
            value={{
                toasts, setToasts,
                createToast, removeToast,
                clearToasts
            }}
        >
            {toasts[0] && (
                <div className={styles.toastContainer} data-closing={toasts[0].closing} onClick={() => {
                    if (toasts[0].onClick) toasts[0].onClick();
                    closeToast(toasts[0].id!);
                }}>
                    <div className={styles.toast}>
                        {toasts[0].icon && <div className={styles.leftSide}>
                            <div className={styles.toastIcon}>
                                {toasts[0].icon.startsWith("fa") ? <i className={toasts[0].icon} /> : <ImageOrVideo className={styles.toastIconImage} src={toasts[0].icon} alt="Toast Icon" />}
                            </div>
                        </div>}

                        <div className={styles.rightSide}>
                            <div className={styles.toastHeader}>{toasts[0].header}</div>
                            <div className={styles.toastBody}>{toasts[0].body}</div>
                        </div>
                    </div>
                </div>
            )}

            {children}
        </ToastStoreContext.Provider>
    );
}
