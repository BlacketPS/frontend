import { GenericContainerProps } from "./genericContainer";
import styles from "../container.module.scss";

export default function GenericContainer({ children }: GenericContainerProps) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}