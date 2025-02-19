import { memo, useState } from "react";
import { Editor, Node, Transforms } from "slate";
import { useChat } from "@stores/ChatStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import UsersTypingContainer from "./UsersTypingContainer";
import MarkdownPreview from "./MarkdownPreview.tsx";
import styles from "../chat.module.scss";

import { InputContainerProps } from "../chat.d";

const isMobile = () => window.innerWidth <= 768;

export default memo(function InputContainer({ placeholder }: InputContainerProps) {
    const { messages, sendMessage, startTyping, usersTyping, replyingTo, setReplyingTo, editing, setEditing } = useChat();
    const { cachedUsers } = useCachedUser();

    const [editor, setEditor] = useState<Editor | null>(null);
    const [mTextareaValue, setMTextareaValue] = useState<string>("");

    const clearEditor = (editor: Editor) => {
        editor.children.map(() => Transforms.delete(editor, { at: [0] }));

        editor.children = [{ type: "paragraph", children: [{ text: "" }] } as Node];

        Transforms.select(editor, { offset: 0, path: [0, 0] });
    };

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

    const send = () => {
        if (isMobile()) {
            if (mTextareaValue.replace(/\s/g, "").length === 0) return;

            const content = mTextareaValue.replace(/@(\w+)/g, (match, username) => {
                const user = cachedUsers.find((user) => user.username.toLowerCase() === username.toLowerCase());

                return user ? `<@${user.id}>` : match;
            });

            sendMessage(content.trim());
            setMTextareaValue("");
        } else {
            if (!editor) return;

            const content = getEditorContent(editor);

            if (content.replace(/\s/g, "").length === 0) return;

            sendMessage(content);

            clearEditor(editor);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.repeat) return;

        switch (e.key) {
            case "Enter":
                if (!e.shiftKey) {
                    e.preventDefault();

                    send();
                }

                break;
            case "ArrowUp":
                if (editing) return;
                if (isMobile()) return;
                if (getEditorContent(editor!) !== "") return;

                e.preventDefault();

                const lastMessage = messages
                    .slice()
                    .find((message) => message.authorId === cachedUsers[0].id)
                if (!lastMessage) return;

                setEditing(lastMessage);

                break;
        }
    };

    return (
        <div className={styles.messageForm}>
            <UsersTypingContainer usersTyping={usersTyping} />

            {replyingTo && <div className={styles.aboveInputContainer}>
                <div>Replying to <b>{cachedUsers.find((user) => user.id === replyingTo.authorId)?.username}</b></div>
                <i className="fas fa-times" onClick={() => setReplyingTo(null)} />
            </div>}

            {isMobile() ? (
                <textarea
                    className={styles.messageInput}
                    placeholder={placeholder}
                    spellCheck
                    autoFocus
                    value={mTextareaValue}
                    onChange={(e) => setMTextareaValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e as any)}

                />
            ) : (
                <MarkdownPreview
                    className={styles.messageInput}
                    placeholder={placeholder}
                    spellCheck
                    autoFocus
                    onInput={() => startTyping()}
                    onKeyDown={handleKeyDown}
                    getEditor={(editor) => setEditor(editor)}
                />
            )}

            <div className={styles.inputButtonsContainer}>
                <div className={styles.inputButton}>
                    <i className="fas fa-paper-plane" onClick={send} />
                </div>
            </div>
        </div>
    );
});
