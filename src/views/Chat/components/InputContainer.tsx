import { memo, useState } from "react";
import { Editor, Node, Transforms } from "slate";
import { useChat } from "@stores/ChatStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import UsersTypingContainer from "./UsersTypingContainer";
import MarkdownPreview from "./MarkdownPreview.tsx";
import styles from "../chat.module.scss";

import { InputContainerProps } from "../chat.d";

export default memo(function InputContainer({ placeholder }: InputContainerProps) {
    const { sendMessage, startTyping, usersTyping, replyingTo, setReplyingTo } = useChat();
    const { cachedUsers } = useCachedUser();

    const [editor, setEditor] = useState<Editor | null>(null);

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

                            if (!editor) return;

                            const content = getEditorContent(editor);

                            if (content.replace(/\s/g, "").length === 0) return;

                            sendMessage(content);

                            clearEditor(editor);
                        }
                    }
                }}
                getEditor={(editor) => setEditor(editor)}
            />
        </div>
    );
});
