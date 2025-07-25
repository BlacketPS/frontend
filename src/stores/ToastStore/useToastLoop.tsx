import { useEffect } from "react";
import { useToast } from "@stores/ToastStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useSound } from "@stores/SoundStore/index";
import { NotificationAccessModal } from "./components";

export function useToastLoop() {
    const { toasts, closeToast } = useToast();
    const { defineSounds, playSound } = useSound();
    const { createModal } = useModal();

    useEffect(() => {
        defineSounds([
            { id: "notification", url: window.constructCDNUrl("/content/audio/sound/notification.mp3") }
        ]);
    }, []);

    useEffect(() => {
        let active = true;

        const toastLoop = () => {
            if (!active) return;

            const toast = toasts[0];
            if (toast && !toast.aboutToClose) {
                playSound("notification");

                try {
                    if (
                        !window.constants.APPLE_DEVICE &&
                        document.visibilityState === "hidden" &&
                        Notification.permission === "granted"
                    ) {
                        const notification = new Notification(toast.header, {
                            body: toast.body,
                            icon: toast.icon,
                            silent: true
                        });

                        notification.addEventListener("click", () => {
                            toast.onClick?.();
                            closeToast(toast.id!);
                        });
                    }
                } catch (err) {
                    console.warn("browser most likely doesn't support notifications");
                }

                setTimeout(() => closeToast(toast.id!), toast.expires);
                toast.aboutToClose = true;
            }

            setTimeout(toastLoop, 100);
        };

        toastLoop();

        try {
            if (
                !window.constants.APPLE_DEVICE &&
                Notification.permission !== "granted" &&
                Notification.permission !== "denied"
            ) {
                createModal(<NotificationAccessModal />);
            }
        } catch (err) {
            console.warn("browser most likely doesn't support notifications");
        }

        return () => {
            active = false;
        };
    }, []);
}
