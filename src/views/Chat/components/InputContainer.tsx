import { memo, useState } from "react";
import { Editor, Node, Transforms } from "slate";
import { useUser } from "@stores/UserStore/index";
import { useChat } from "@stores/ChatStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useModal } from "@stores/ModalStore/index";
import UsersTypingContainer from "./UsersTypingContainer";
import FileUploadContainer from "./FileUploadContainer";
import ChangeChatColorModal from "./ChangeChatColorModal";
import MarkdownEditor from "./MarkdownEditor";
import styles from "../chat.module.scss";

import { InputContainerProps } from "../chat.d";
import { PermissionTypeEnum } from "@blacket/types";

const isMobile = () => window.innerWidth <= 768;

export default memo(function InputContainer({ placeholder }: InputContainerProps) {
    const { user } = useUser();
    if (!user) return null;

    const { messages, sendMessage, startTyping, replyingTo, setReplyingTo, editing, setEditing } = useChat();
    const { cachedUsers } = useCachedUser();
    const { createModal } = useModal();

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
            case "Enter": {
                if (!e.shiftKey && !isMobile()) {
                    e.preventDefault();

                    send();
                }

                break;
            }
            case "ArrowUp": {
                if (!editor || editing || isMobile() || getEditorContent(editor) !== "") return;

                e.preventDefault();

                const lastMessage = messages
                    .slice()
                    .find((message) => message.authorId === user.id);
                if (!lastMessage) return;

                setEditing(lastMessage);

                break;
            }
        }
    };

    const openColorPickerModal = () => createModal(<ChangeChatColorModal />);

    return (
        <div className={styles.messageForm}>
            <UsersTypingContainer />

            <div
                style={{
                    position: "absolute",
                    bottom: "99%"
                }}
            ></div>

            {replyingTo && <div className={styles.aboveInputContainer}>
                <div>Replying to <b>{cachedUsers.find((user) => user.id === replyingTo.authorId)?.username}</b></div>
                <i className="fas fa-times" onClick={() => setReplyingTo(null)} />
            </div>}

            <div className={styles.leftInputButtonsContainer}>
                {user.hasPermission(PermissionTypeEnum.UPLOAD_FILES_SMALL) && <FileUploadContainer />}
            </div>

            {isMobile() ? (
                <>
                    <textarea
                        className={styles.messageInput}
                        placeholder={placeholder}
                        style={{ color: user.settings.chatColor || undefined }}
                        spellCheck
                        autoFocus
                        value={mTextareaValue}
                        onInput={() => startTyping()}
                        onChange={(e) => setMTextareaValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e as any)}
                    />
                </>
            ) : (
                <MarkdownEditor
                    className={styles.messageInput}
                    placeholder={placeholder}
                    color={user.settings.chatColor || undefined}
                    spellCheck
                    autoFocus
                    onInput={() => startTyping()}
                    onKeyDown={handleKeyDown}
                    getEditor={(editor) => setEditor(editor)}
                />
            )}

            <div className={styles.rightInputButtonsContainer}>
                {user.hasPermission(PermissionTypeEnum.USE_CHAT_COLORS) && <div className={styles.inputButton} onClick={openColorPickerModal}>
                    <i className="fas fa-paint-brush" />
                </div>}

                <div className={styles.inputButton} onClick={send}>
                    <i className="fas fa-paper-plane" />
                </div>
            </div>
        </div>
    );
});
