import { useToast } from "@stores/ToastStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../toast.module.scss";

export default function ToastUI() {
    const { toasts, closeToast } = useToast();
    if (!toasts[0]) return null;

    const toast = toasts[0];

    return (
        <div
            className={styles.toastContainer}
            data-closing={toast.closing}
            onClick={() => {
                toast.onClick?.();

                closeToast(toast.id!);
            }}
        >
            <div className={styles.toast}>
                {toast.icon && (
                    <div className={styles.leftSide}>
                        <div className={styles.toastIcon}>
                            {toast.icon.startsWith("fa") ? (
                                <i className={toast.icon} />
                            ) : (
                                <ImageOrVideo
                                    className={styles.toastIconImage}
                                    src={toast.icon}
                                    alt="Toast Icon"
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.rightSide}>
                    <div className={styles.toastHeader}>{toast.header}</div>
                    <div className={styles.toastBody}>{toast.body}</div>
                </div>
            </div>
        </div>
    );
}
