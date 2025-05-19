import styles from "../home.module.scss";

export default function TopText() {
    return (
        <div className={styles.topHeaderContainer}>
            <div className={styles.logoText}>{import.meta.env.VITE_INFORMATION_NAME}</div>
        </div>
    );
}
