import { memo } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import MarkdownPreview from "./MarkdownPreview.tsx";
import timestamps from "@functions/core/timestamps";
import { ImageOrVideo, Username } from "@components/index";
import styles from "../chat.module.scss";

import { ChatMessageProps } from "../chat.d";

export default memo(function ChatMessage({ message, newUser, mentionsMe, isSending, messageContextMenu, userContextMenu }: ChatMessageProps) {
    if (!messageContextMenu || isSending) messageContextMenu = () => { };
    if (!userContextMenu || isSending) userContextMenu = () => { };

    const { getUserAvatarPath } = useUser();
    const { cachedUsers } = useCachedUser();

    const author = cachedUsers.find((user) => user.id === message.authorId) || null;
    const replyingToAuthor = cachedUsers.find((user) => user.id === message?.replyingTo?.authorId) || null;

    if (author) return (
        <span className={styles.messageHolder} style={{
            marginTop: (newUser || message.replyingTo) ? "15px" : ""
        }}>
            <li className={`${styles.message}${mentionsMe ? ` ${styles.mention}` : ""}`}
                data-message-id={message.id}
                onContextMenu={(e) => {
                    e.preventDefault();

                    messageContextMenu(e);
                }}
            >
                {message.replyingTo && replyingToAuthor && <div className={styles.replyingTo} onClick={() => {
                    const messageElement = document.querySelector(`[data-message-id="${message!.replyingTo!.id}"]`);

                    if (messageElement) messageElement.scrollIntoView({ behavior: "smooth", block: "center" });

                    messageElement?.classList.add(styles.highlightedMessage);
                    setTimeout(() => messageElement?.classList.remove(styles.highlightedMessage), 1500);
                }}>
                    <img src={window.constructCDNUrl("/content/reply.svg")} />

                    <ImageOrVideo src={getUserAvatarPath(replyingToAuthor)} className={styles.replyingToAvatar} />

                    <Username user={replyingToAuthor} className={styles.replyingToUsername} />

                    <i className="fas fa-circle" style={{ fontSize: "0.2rem" }} />

                    <MarkdownPreview content={`${message.replyingTo.content.split("\n")[0]}${message.replyingTo.content.split("\n").length > 1 ? "..." : ""}`} readOnly={true} />
                </div>}

                <div className={styles.messageContainer}>
                    {(newUser || message.replyingTo) && <Link to={`/dashboard?name=${author.username}`} className={`${styles.messageAvatarContainer} ${styles.messageAvatar}`} onClick={(e) => {
                        if (window.innerWidth <= 850) e.preventDefault();
                    }} onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        userContextMenu(e);
                    }}>
                        <ImageOrVideo className={styles.avatar} src={getUserAvatarPath(author)} />
                    </Link>}

                    <div className={styles.messageContentContainer}>
                        {(newUser || message.replyingTo) && <div className={styles.usernameContainer} onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            userContextMenu(e);
                        }}>
                            <Username user={author} onClick={(e) => {
                                if (window.innerWidth <= 850) e.preventDefault();
                            }} />

                            <div className={styles.messageBigTimestamp}>
                                {timestamps(message.createdAt.toString())}
                            </div>

                            {
                                /* author.badges.length > 0 && <div className={styles.messageBadgeContainer}>
                                    {
                                        // badges.map((badge, index) => <img key={index} src={badge} className={styles.messageBadge} />)
                                    }
                                </div> */
                            }
                        </div>}

                        <div style={{ opacity: isSending ? 0.5 : "" }} className={styles.messageContent}>
                            {!(newUser || message.replyingTo) && <div className={styles.messageSmallTimestamp}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>}

                            <MarkdownPreview content={message.content} readOnly={true} />
                        </div>
                    </div>
                </div>
            </li>
        </span>
    );
});
