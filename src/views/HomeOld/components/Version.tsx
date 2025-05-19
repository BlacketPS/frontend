import styles from "../home.module.scss";

export default function Version() {
    return <div className={styles.versionInformation}>Running Blacket v{import.meta.env.VITE_INFORMATION_VERSION}</div>;
}
