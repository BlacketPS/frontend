import { memo } from "react";
import { useCachedUser } from "@stores/CachedUserStore/index";
import styles from "../chat.module.scss";

import { UsersTypingProps } from "../chat.d";

export default memo(function UsersTypingContainer({ usersTyping }: UsersTypingProps) {
    const { cachedUsers } = useCachedUser();

    const users = cachedUsers.filter((user) => usersTyping.some((typingUser) => typingUser.userId === user.id));

    return (
        <div className={styles.usersTypingContainer} data-visible={usersTyping.length > 0}>
            {
                usersTyping.length > 0 ? (
                    usersTyping.length > 4 ? <b>{usersTyping.length} people are typing...</b> :
                        <>
                            {users.sort((a, b) => b.username.localeCompare(a.username)).map((user, index) => <b key={user.id} className={
                                user.color === "rainbow" ? "rainbow" : ""
                            } style={{ color: user.color }}>{user.username}{index === usersTyping.length - 1 ? "" : ", "}</b>)}
                            {usersTyping.length === 1 ? " is typing..." : " are typing..."}
                        </>
                ) : null
            }
        </div>
    );
});
