import { memo, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useChat } from "@stores/ChatStore/index";
import { useContextMenu } from "@stores/ContextMenuStore/index";
import { ChatContainer, ChatMessagesContainer, ChatMessage, InputContainer } from "./components";
import styles from "./chat.module.scss";

export default memo(function Chat() {
    const { user } = useUser();
    const { messages, replyingTo, setReplyingTo, resetMentions } = useChat();
    const { openContextMenu } = useContextMenu();

    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" />;

    useEffect(() => {
        resetMentions();
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
                        mentionsMe={message.mentions.includes(user.id) || (message.replyingTo && message.replyingTo.authorId === user.id)}
                        isSending={message.nonce}
                        messageContextMenu={() => openContextMenu([
                            // message.authorId === user.id && { label: "Edit", icon: "fas fa-edit", onClick: () => console.log("edit") },
                            { label: "Reply", icon: "fas fa-reply", onClick: () => setReplyingTo(message) },
                            { label: "Copy Text", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(message.content) },
                            // message.authorId !== user.id && { label: "Report", icon: "fas fa-flag", color: "#F54242", onClick: () => console.log("report") },
                            { label: "Delete", icon: "fas fa-trash", color: "#F54242", onClick: () => console.log("delete") },
                            { divider: true },
                            { label: "Copy Raw Message", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(JSON.stringify(message)) },
                            { label: "Copy Message ID", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(message.id.toString()) }
                        ])}
                        userContextMenu={() => openContextMenu([
                            { label: "View Profile", icon: "fas fa-user", onClick: () => navigate(`/dashboard?name=${message.author.username}`) },
                            // message.authorId !== user.id && { label: "Send Message", icon: "fas fa-paper-plane", onClick: () => console.log("send message") },
                            { label: "Mention", icon: "fas fa-at", onClick: () => console.log("mention") },
                            // message.authorId !== user.id && { label: "Block", icon: "fas fa-ban", color: "#F54242", onClick: () => console.log("block") },
                            { divider: true },
                            { label: "Copy User ID", icon: "fas fa-copy", onClick: () => navigator.clipboard.writeText(message.authorId) }
                        ])}
                    />)}
                </ChatMessagesContainer>

                <InputContainer placeholder="Message #global" maxLength={2048} />
            </ChatContainer>

            <div className={styles.roomSidebar} />
        </>
    );
});
