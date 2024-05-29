import { memo, ReactNode } from "react";
import styles from "../chat.module.scss";

export default memo(function ChatContainer({ children }: { children: ReactNode }) {
    return <div className={styles.container}>{children}</div>;
});
