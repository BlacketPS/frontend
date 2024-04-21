import { ReactNode } from "react";
import styles from "../home.module.scss";

export default function WelcomeContainer({ children }: { children: ReactNode }) {
    return <div className={styles.welcomeContainer}>{children}</div>;
}
