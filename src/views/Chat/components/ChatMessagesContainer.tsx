import { memo } from "react";
import styles from "../chat.module.scss";

import { ChatMessagesContainerProps } from "../chat.d";

export default memo(function ChatMessagesContainer({ aboveInput, children }: ChatMessagesContainerProps) {
    return <ul className={styles.messagesContainer} data-above-input={aboveInput ? true : false} onContextMenu={(e) => e.preventDefault()}>{children}</ul>;
});
