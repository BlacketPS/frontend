import { Link } from "react-router-dom";
import { useUser } from "@stores/UserStore";
import styles from "../home.module.scss";

export default function TopButtons() {
    const { user } = useUser();

    return (
        <div className={styles.topButtonContainer}>
            {!user && <Link className={`${styles.topButton} ${styles.loginButton}`} to="/login">Login</Link>}
            {!user ?
                <Link className={`${styles.topButton} ${styles.registerButton}`} to="/register">Register</Link> :
                <Link className={`${styles.topButton} ${styles.dashboardButton}`} to="/dashboard">Dashboard</Link>}
        </div>
    );
}
