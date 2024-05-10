import { memo, useState } from "react";
import { useChat } from "@stores/ChatStore/index";
import UsersTypingContainer from "./UsersTypingContainer";
import MarkdownPreview from "./MarkdownPreview";
import styles from "../chat.module.scss";

import { BlacketEditor, InputContainerProps } from "../chat.d";

export default memo(function InputContainer({ placeholder, maxLength }: InputContainerProps) {
    const { cachedUsers, sendMessage, startTyping, usersTyping, replyingTo, setReplyingTo } = useChat();

    const [editor, setEditor] = useState<BlacketEditor | null>(null);
    const [content, setContent] = useState<string>("");

    return (
        <div className={styles.messageForm}>
            <UsersTypingContainer usersTyping={usersTyping} />

            {replyingTo && <div className={styles.aboveInputContainer}>
                <div>Replying to <b>{cachedUsers.find((user) => user.id === replyingTo.authorId)?.username}</b></div>
                <i className="fas fa-times" onClick={() => setReplyingTo(null)} />
            </div>}

            <MarkdownPreview
                className={styles.messageInput}
                placeholder={placeholder}
                spellCheck
                autoFocus
                onInput={() => startTyping()}
                onKeyDown={(e: KeyboardEvent) => {
                    if (!e.repeat) {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();

                            if (content.replace(/\s/g, "").length === 0) return;

                            sendMessage(content.trim());
                            // console.log(content.trim());

                            if (editor) editor.clearContent();
                            setContent("");
                        }
                    }
                }}
                onLeafChange={(e: BlacketEditor) => {
                    if (!editor) setEditor(e);

                    setContent(e.children.map((object: any) => object.children[0].text).join("\n"));
                }}
            />
        </div>
    );
});
