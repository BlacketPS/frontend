// TODO: mobile support is buggy

import { memo, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useChat } from "@stores/ChatStore/index";
import { useContextMenu } from "@stores/ContextMenuStore/index";
import { useToast } from "@stores/ToastStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useDeleteMessage } from "@controllers/chat/messages/roomId/useDeleteMessage/index";
import { useEditMessage } from "@controllers/chat/messages/roomId/useEditMessage/index";
import { ChatContainer, ChatMessagesContainer, ChatMessage, InputContainer } from "./components";

import { PermissionTypeEnum } from "@blacket/types";

export default memo(function Chat() {
    const { user } = useUser();
    const { messages, replyingTo, setReplyingTo, editing, setEditing, resetMentions } = useChat();
    const { openContextMenu } = useContextMenu();
    const { createToast } = useToast();
    const { addCachedUser } = useCachedUser();

    const { deleteMessage } = useDeleteMessage();
    const { editMessage } = useEditMessage();

    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" />;

    useEffect(() => {
        resetMentions();

        setEditing(null);
    }, []);

    return (
        <>
            <ChatContainer>
                <ChatMessagesContainer aboveInput={replyingTo ? true : false}>
                    {messages.map((message) => <ChatMessage
                        key={message.id}
                        message={message}
                        newUser={
                            messages[messages.indexOf(message) + 1] && messages[messages.indexOf(message) + 1].authorId !== message.authorId ||
                            messages.indexOf(message) === messages.length - 1
                        }
                        mentionsMe={message.mentions.includes(user.id) || (message?.replyingTo?.authorId === user.id)}
                        isSending={message.nonce !== undefined}
                        isEditing={editing?.id === message.id}
                        messageContextMenu={() => openContextMenu([
                            message.authorId === user.id ? { label: "Edit", icon: "fas fa-edit", onClick: () => setEditing(message) } : null,
                            { label: "Reply", icon: "fas fa-reply", onClick: () => setReplyingTo(message) },
                            { label: "Copy Text", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(message.content) },
                            message.authorId !== user.id ? { label: "Report", icon: "fas fa-flag", color: "#F54242", onClick: () => console.log("report") } : null,

                            (
                                message.authorId === user.id
                                || user.hasPermission(PermissionTypeEnum.MANAGE_MESSAGES)
                            ) ? {
                                label: "Delete", icon: "fas fa-trash", color: "#F54242", onClick: () => {
                                    console.log(message);
                                    deleteMessage(message.roomId, message.id)
                                        .catch((err: Fetch2Response) => createToast({
                                            header: "Error",
                                            body: err.data.message,
                                            icon: window.constructCDNUrl("/content/icons/error.png")
                                        }));
                                }
                            } : null,

                            { divider: true },

                            { label: "Copy Raw Message", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(JSON.stringify(message)) },
                            { label: "Copy Message ID", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(message.id.toString()) }
                        ])}
                        userContextMenu={() => openContextMenu([
                            { label: "View Profile", icon: "fas fa-user", onClick: async () => navigate(`/dashboard?name=${(await addCachedUser(message.authorId)).username}`) },
                            // TODO: finish this after the rewrite
                            // message.authorId !== user.id && { label: "Send Message", icon: "fas fa-paper-plane", onClick: () => console.log("send message") },
                            { label: "Mention", icon: "fas fa-at", onClick: () => console.log("mention") },
                            message.authorId !== user.id ? { label: "Block", icon: "fas fa-ban", color: "#F54242", onClick: () => console.log("block") } : null,

                            { divider: true },

                            { label: "Copy User ID", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(message.authorId) }
                        ])}
                        onEditSave={(newMessage) => {
                            setEditing(null);

                            editMessage(message.roomId, message.id, { content: newMessage })
                                .catch((err: Fetch2Response) => createToast({
                                    header: "Error",
                                    body: err.data.message,
                                    icon: window.constructCDNUrl("/content/icons/error.png")
                                }));
                        }}
                        onEditCancel={() => setEditing(null)}
                    />)}
                </ChatMessagesContainer>

                <InputContainer placeholder="Message #global" maxLength={2048} />
            </ChatContainer>

            {
                // TODO: finish this after the rewrite
                /* <div className={styles.roomSidebar} /> */
            }
        </>
    );
});
