import { Link } from "react-router-dom";
import styles from "../home.module.scss";

export default function TOSLink() {
    return <Link to="/terms" className={styles.termsOfServiceLink}>Terms of Service</Link>;
}
