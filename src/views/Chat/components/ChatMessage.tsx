import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChat } from "@stores/ChatStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import MarkdownPreview from "./MarkdownPreview";
import timestamps from "@functions/core/timestamps";
import { ImageOrVideo } from "@components/index";
import styles from "../chat.module.scss";

import { ChatMessageProps } from "../chat.d";

export default memo(function ChatMessage({ id, author, newUser, createdAt, replyingTo, replyingToAuthor, mentionsMe, isSending, rawMessage, messageContextMenu, userContextMenu, children }: ChatMessageProps) {
    if (!messageContextMenu || isSending) messageContextMenu = () => { };
    if (!userContextMenu || isSending) userContextMenu = () => { };

    const { setReplyingTo } = useChat();
    const { getUserAvatarPath } = useUser();
    const { fontIdToName } = useData();

    const messagePosition = useSpring<{ x: number }>({ x: 0 });
    const bindMessage = useDrag((params) => {
        if (window.innerWidth > 850) return;
        if (params.dragging) {

            // if (params.movement[0] <= -100) setAllowReply(true);
            // else setAllowReply(false);

            if (params.movement[0] < 0 && params.movement[0] > -115) {
                messagePosition.x.set(params.movement[0]);
            }
        } else {
            if (messagePosition.x.get() <= -90) setReplyingTo(rawMessage);
            // setAllowReply(false)
            messagePosition.x.start(0);
        }
    });

    const messageRef = useRef<HTMLSpanElement>(null);
    const [messageHeight, setMessageHeight] = useState(0);

    useEffect(() => {
        if (messageRef.current) setMessageHeight(messageRef.current.clientHeight);
    }, [messageRef]);

    const authorAvatarURL = getUserAvatarPath(author);
    const replyingToAvatarURL = getUserAvatarPath(replyingToAuthor);
    const fontName = fontIdToName(author?.fontId);

    if (author) return (
        <animated.span ref={messageRef} {...bindMessage()} className={styles.messageHolder} style={{
            marginTop: (newUser || replyingTo) ? "15px" : "",
            touchAction: "none",
            backgroundColor: messagePosition.x.to([0, -115], ["rgba(0,0,0, 0)", "rgba(0,0,0, 0.3)"])
        }}>

            <animated.i className={`${styles.replyIcon} fas fa-reply`} style={{
                height: messageHeight >= 75 ? "30px" : `${Math.floor(messageHeight * 0.5)}px`,
                width: messageHeight >= 75 ? "30px" : `${Math.floor(messageHeight * 0.5)}px`,
                fontSize: messageHeight >= 75 ? "20px" : `${Math.floor(messageHeight * 0.4)}px`,
                right: messagePosition.x.to([0, -115], ["-50px", "20px"]),
                transform: messagePosition.x.to([0, -115], ["translateY(-50%) rotate(180deg)", "translateY(-50%) rotate(0deg)"])
            }} />

            <animated.li className={`${styles.message} ${mentionsMe ? `${styles.mention}` : ""}`}
                style={{
                    x: messagePosition.x,
                    backgroundColor: messagePosition.x.to([0, -115], ["rgba(0,0,0, 0)", "rgba(0,0,0, 0.3)"]),
                    borderRadius: messagePosition.x.to([0, -115], ["0", "5px"])
                }}
                data-message-id={id}
                onContextMenu={(e) => {
                    e.preventDefault();

                    messageContextMenu(e);
                }}
            >

                {replyingTo && replyingToAuthor && <div className={styles.replyingTo} onClick={() => {
                    const message = document.querySelector(`[data-message-id="${replyingTo.id}"]`);

                    if (message) message.scrollIntoView({ behavior: "smooth", block: "center" });

                    message?.classList.add(styles.highlightedMessage);
                    setTimeout(() => message?.classList.remove(styles.highlightedMessage), 1500);
                }}>
                    <img src="https://cdn.blacket.org/static/content/replyingToArrow.png" />

                    <ImageOrVideo src={replyingToAvatarURL} />

                    <div className={`
                        ${styles.replyingToUsername}
                        ${replyingToAuthor.color === "rainbow" ? "rainbow" : ""}
                    `} style={{
                            color: replyingToAuthor.color,
                            fontFamily: fontName
                        }}>{replyingToAuthor.username}</div>
                    <i className="fas fa-circle" style={{ fontSize: "0.2rem" }} />

                    <MarkdownPreview content={`${replyingTo.content.split("\n")[0]}${replyingTo.content.split("\n").length > 1 ? "..." : ""}`} readOnly={true} />
                </div>}

                <div className={styles.messageContainer}>
                    {(newUser || replyingTo) && <Link to={`/dashboard?name=${author.username}`} className={`${styles.messageAvatarContainer} ${styles.messageAvatar}`} onClick={(e) => {
                        if (window.innerWidth <= 850) e.preventDefault();
                    }} onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        userContextMenu(e);
                    }}>
                        <ImageOrVideo className={styles.avatar} src={authorAvatarURL} />
                    </Link>}

                    <div className={styles.messageContentContainer}>
                        {(newUser || replyingTo) && <div className={styles.usernameContainer} onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            userContextMenu(e);
                        }}>
                            <Link to={`/dashboard?name=${author.username}`} className={`
                        ${styles.messageUsername}
                        ${author.color === "rainbow" ? "rainbow" : ""}
                    `} style={{
                                    color: author.color,
                                    fontFamily: fontName
                                }} onClick={(e) => {
                                    if (window.innerWidth <= 850) e.preventDefault();
                                }}>
                                {author.username}
                            </Link>

                            <div className={styles.messageBigTimestamp}>
                                {timestamps(createdAt.toString())}
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
                            {!(newUser || replyingTo) && <div className={styles.messageSmallTimestamp}>
                                {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>}

                            <MarkdownPreview content={children} readOnly={true} />
                        </div>
                    </div>
                </div>
            </animated.li>
        </animated.span>
    );
});
