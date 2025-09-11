import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Twemoji from "react-twemoji";
import { Editor, Transforms } from "slate";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import MarkdownEditor from "./MarkdownEditor";
import timestamps from "@functions/blacket/timestamps";
import { Blook, Username } from "@components/index";
import styles from "../chat.module.scss";

import { ChatMessageProps } from "../chat.d";

export default memo(function ChatMessage({ message, newUser, mentionsMe, isSending, isEditing, messageContextMenu, userContextMenu, onEditSave, onEditCancel }: ChatMessageProps) {
    if (!messageContextMenu || isSending) messageContextMenu = () => { };
    if (!userContextMenu || isSending) userContextMenu = () => { };
    if (!onEditSave || isSending) onEditSave = () => { };
    if (!onEditCancel || isSending) onEditCancel = () => { };

    const { getUserAvatarPath, isAvatarBig } = useUser();
    const { cachedUsers } = useCachedUser();

    const [editor, setEditor] = useState<Editor | null>(null);
    const [contentKey, setContentKey] = useState(0);

    const editingInputRef = useRef<HTMLDivElement>(null);

    const author = cachedUsers.find((user) => user.id === message.authorId) || null;
    const replyingToAuthor = cachedUsers.find((user) => user.id === message?.replyingTo?.authorId) || null;

    useEffect(() => {
        setContentKey(contentKey + 1);
    }, [
        message.content,
        message.replyingTo?.content
    ]);

    useMemo(() => {
        if (editor) {
            const point = Editor.end(editor, []);
            Transforms.select(editor, point);
        }
    }, [editor]);

    const getEditorContent = (editor: Editor) => {
        let content = "";
        editor.children.map((object: any) => {
            object.children.map((child: any) => {
                if (child.text) content += child.text;
                else if (child.text === "") content += "\n";
                else if (child.type === "mention") content += `<@${child.user.id}>`;
            });
        });

        return content.trim();
    };

    const handleEditSave = (content: string) => onEditSave(content);

    const big = isAvatarBig(author);

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

                    <Blook
                        className={styles.replyingToAvatar}
                        src={getUserAvatarPath(replyingToAuthor)}
                        shiny={replyingToAuthor.avatar?.shiny}
                        draggable={false}
                    />

                    <Username user={replyingToAuthor} className={styles.replyingToUsername} />

                    <i className="fas fa-circle" style={{ fontSize: "0.2rem" }} />

                    <Twemoji options={{ className: `${styles.emoji} ${styles.emojiReply}` }}>
                        <MarkdownEditor key={contentKey} content={`${message.replyingTo.content.split("\n")[0]}${message.replyingTo.content.split("\n").length > 1 ? "..." : ""}`} color={message.color || undefined} readOnly={true} />
                    </Twemoji>
                </div>}

                <div className={styles.messageContainer}>
                    {(newUser || message.replyingTo) && <Link to={`/dashboard?name=${author.username}`} className={`${styles.messageAvatarContainer} ${styles.messageAvatar}`} onClick={(e) => {
                        if (window.innerWidth <= 850) e.preventDefault();
                    }} onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        userContextMenu(e);
                    }}
                        style={big ? {
                            transform: "scale(1.4)",
                            marginLeft: 5
                        } : undefined}
                    >
                        <Blook
                            src={getUserAvatarPath(author)}
                            shiny={author.avatar?.shiny}
                            draggable={false}
                        />
                    </Link>}

                    <div
                        className={styles.messageContentContainer}
                        style={big ? {
                            marginLeft: 75
                        } : undefined}
                    >
                        {(newUser || message.replyingTo) && <div className={styles.usernameContainer} onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            userContextMenu(e);
                        }}
                            style={big ? {
                                marginTop: 15
                            } : undefined}
                        >
                            <Username user={author} onClick={(e) => {
                                if (window.innerWidth <= 850) e.preventDefault();
                            }} />

                            <div className={styles.messageBigTimestamp}>
                                {timestamps(message.createdAt.toString())}
                            </div>

                            {
                                // TODO: badges on messages

                                author.badges.length > 0 && <div className={styles.messageBadgeContainer}>
                                    {
                                        // badges.map((badge, index) => <img key={index} src={badge} className={styles.messageBadge} />)
                                    }
                                </div>
                            }
                        </div>}

                        <div style={{
                            opacity: (isSending && !message.error) ? 0.5 : "",
                            color: message.error ? "#ce1313" : ""
                        }} className={styles.messageContent}>
                            {!(newUser || message.replyingTo) && <div className={styles.messageSmallTimestamp}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>}

                            {!isEditing
                                // replacing new line with double new line for it to actually be rendered as a new line for whatever reason (slate bs) this also causes extra newlines, someone should probably fix this but im not messing with slate again.
                                ? <Twemoji options={{ className: styles.emoji }}><MarkdownEditor key={contentKey} content={message.content.replaceAll(/\n/g, "\n\n")} color={message.color || undefined} readOnly={true} /></Twemoji>
                                : <>
                                    <MarkdownEditor
                                        key={contentKey}
                                        ref={editingInputRef}
                                        content={message.content}
                                        color={message.color || undefined}
                                        className={styles.editingMessageInput}
                                        autoFocus={true}
                                        readOnly={false}
                                        getEditor={(editor) => setEditor(editor)}
                                        onKeyDown={(e: KeyboardEvent) => {
                                            if (!e.repeat) {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();

                                                    if (!editor) return;

                                                    const content = getEditorContent(editor);

                                                    if (content.replace(/\s/g, "").length === 0) return;

                                                    handleEditSave(content);
                                                } else if (e.key === "Escape") {
                                                    onEditCancel();
                                                }
                                            }
                                        }}
                                    />

                                    <div className={styles.editingMessageText}>
                                        escape to <span
                                            className={styles.editingMessageCancelText}
                                            onClick={onEditCancel}
                                        >
                                            cancel
                                        </span> | enter to <span
                                            className={styles.editingMessageSaveText}
                                            onClick={() => {
                                                if (!editor) return;

                                                const content = getEditorContent(editor);

                                                if (content.replace(/\s/g, "").length === 0) return;

                                                onEditSave(content);
                                            }}
                                        >
                                            save
                                        </span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    {message.editedAt && <span className={styles.edited}>(edited)</span>}
                </div>
            </li>
        </span>
    );
});
