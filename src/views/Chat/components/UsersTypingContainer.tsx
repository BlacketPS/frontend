import { useCachedUser } from "@stores/CachedUserStore/index";
import { Username } from "@components/index";
import styles from "../chat.module.scss";

// import { UsersTypingProps } from "../chat.d";

export default function UsersTypingContainer() {
    const { cachedUsers } = useCachedUser();

    // const users = cachedUsers.filter((user) => usersTyping.some((typingUser) => typingUser.userId === user.id));

    return (
        <></>
    );

    // return (
    //     <div className={styles.usersTypingContainer} data-visible={usersTyping.length > 0}>
    //         {usersTyping.length > 0 ? (
    //             usersTyping.length > 4 ? <b>{usersTyping.length} people are typing...</b> :
    //                 <>
    //                     {users.sort((a, b) => b.username.localeCompare(a.username)).map((user, index) => <span key={user.id}>
    //                         <Username user={user} />{index === usersTyping.length - 1 ? "" : ", "}
    //                     </span>)}

    //                     {usersTyping.length === 1 ? " is typing..." : " are typing..."}
    //                 </>
    //         ) : null}
    //     </div>
    // );
}
