import { Link } from "react-router-dom";
import { HeaderProps } from "./header.d";
import styles from "./header.module.scss";

export default function Header({ noLink, right }: HeaderProps) {
    return (
        <div className={styles.header}>
            <Link className={styles.headerLeft} to={!noLink ? "/" : window.location.pathname}>{import.meta.env.VITE_INFORMATION_NAME}</Link>
            {right && <Link className={styles.headerRight} to={right.link}>{right.text}</Link>}
        </div>
    );
}
