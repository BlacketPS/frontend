import { Link } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import styles from "./header.module.scss";

import { HeaderProps } from "./header.d";

export default function Header({ noLink, right }: HeaderProps) {
    const { user } = useUser();

    return (
        <div className={styles.header}>
            <Link className={styles.headerLeft} to={!noLink ? user ? "/dashboard" : "/" : window.location.pathname}>{import.meta.env.VITE_INFORMATION_NAME}</Link>
            {right && <Link className={styles.headerRight} to={right.link}>{right.text}</Link>}
        </div>
    );
}
