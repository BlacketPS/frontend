import { useCallback, useMemo, useRef, useState } from "react";
import Twemoji from "react-twemoji";
import { Editor, Node, Transforms, Range, createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { Blook, Username } from "@components/index";
import { withCustomElement, insertEmoji, insertMention } from "./utils";
import decorate from "./decorate";
import Element from "./elements";
import Leaf from "./Leaf";
import styles from "../../chat.module.scss";

import { MarkdownEditorProps } from "../../chat.d";

export default function MarkdownEditor({ content, color, readOnly, getEditor = () => { }, ...props }: MarkdownEditorProps) {
    const { getUserAvatarPath } = useUser();
    const { cachedUsers } = useCachedUser();

    const mentionRef = useRef<HTMLDivElement | null>(null);
    const emojiRef = useRef<HTMLDivElement | null>(null);
    const [mentionSearch, setMentionSearch] = useState<string>("");
    const [emojiSearch, setEmojiSearch] = useState<string>("");

    const mentionUsers = useMemo(() => {
        if (!mentionSearch) return [];
        return cachedUsers.filter((user) => user.username.toLowerCase().startsWith(mentionSearch.toLowerCase())).slice(0, 10);
    }, [mentionSearch, cachedUsers]);

    const emojis = useMemo(() => {
        if (!emojiSearch) return [];
        return window.constants.emojis.filter((emoji) => emoji.key.toLowerCase().startsWith(emojiSearch.toLowerCase())).slice(0, 10);
    }, [emojiSearch]);

    const [mentionTarget, setMentionTarget] = useState<Range | null>(null);
    const [emojiTarget, setEmojiTarget] = useState<Range | null>(null);
    const [mentionUserId, setMentionUserId] = useState<string>(mentionUsers[0]?.id || "");
    const [emojiName, setEmojiName] = useState<string>(emojis[0]?.key || "");

    const editor = useMemo(() => withCustomElement(withReact(createEditor())), []);

    getEditor(editor);

    const initialValue = content
        ? content.toString().split("\n").map((text: string) => ({ type: "paragraph" as const, children: [{ text }] }))
        : [{ type: "paragraph" as const, children: [{ text: "" }] }];

    const renderElement = useCallback((props: any) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: any) => <Leaf {...props} readOnly={readOnly} />, []);

    return (
        <Slate editor={editor} initialValue={initialValue} onChange={() => {
            const { selection } = editor;

            // this is for mentions below
            if (selection && Range.isCollapsed(selection)) {
                const [start] = Range.edges(selection);
                const wordBefore = Editor.before(editor, start, { unit: "word" });
                const before = wordBefore && Editor.before(editor, wordBefore);
                const beforeRange = before && Editor.range(editor, before, start);
                const beforeText = beforeRange && Editor.string(editor, beforeRange);

                const beforeMatch = beforeText && beforeText.match(/^@([\w_]*)$/);

                if (beforeMatch) {
                    setMentionTarget(beforeRange);
                    setMentionSearch(beforeMatch[1]);
                    setMentionUserId(cachedUsers.find((user) => user.username.toLowerCase().startsWith(beforeMatch[1].toLowerCase()))?.id || "");
                    return;
                }
            }

            // i know this is a shit workaround but it works, you can clean it up and do this better if you want
            const getPointAtGlobalOffset = (
                // @ts-expect-error
                editor,
                // @ts-expect-error
                globalOffset
            ) => {
                let currentOffset = 0;

                for (const [node, path] of Node.texts(editor)) {
                    const nodeText = Node.string(node);
                    const nodeLength = nodeText.length;

                    if (currentOffset + nodeLength >= globalOffset) {
                        const offsetInNode = globalOffset - currentOffset;
                        return { path, offset: offsetInNode };
                    }

                    currentOffset += nodeLength;
                }

                return null;
            };

            // this is for emojis below
            if (selection && Range.isCollapsed(selection)) {
                const [start] = Range.edges(selection);
                let current = start;
                let foundColon = false;

                while (!foundColon) {
                    const previous = Editor.before(editor, current);
                    if (!previous) break;

                    const charRange = { anchor: previous, focus: current };
                    const char = Editor.string(editor, charRange);

                    if (char === ":") {
                        foundColon = true;
                        current = previous;
                        break;
                    } else if (!char.match(/^[\w_]$/)) break;

                    current = previous;
                }

                if (foundColon) {
                    const beforeRange = { anchor: current, focus: start };
                    const beforeText = Editor.string(editor, beforeRange);
                    const match = beforeText.match(/^:([\w_]+)$/);

                    const wordRange = Editor.range(editor, Editor.start(editor, start.path), start);
                    const wordText = Editor.string(editor, wordRange);
                    const fullMatch = wordText.match(/(?<!\w):[\w_]+:(?!\w)/);

                    if (fullMatch) {
                        const emoji = window.constants.emojis.find((e) => e.key === fullMatch[0].replaceAll(":", "").toLowerCase());
                        if (emoji) {
                            Transforms.delete(editor, {
                                at: {
                                    anchor: getPointAtGlobalOffset(editor, fullMatch.index!)!,
                                    focus: getPointAtGlobalOffset(editor, fullMatch.index! + fullMatch[0].length)!
                                }
                            });
                            insertEmoji(editor, emoji.value);
                            return;
                        }
                    }

                    if (match) {
                        setEmojiTarget(beforeRange);
                        setEmojiSearch(match[1]);
                        const emoji = window.constants.emojis.find((e) => e.key.toLowerCase().startsWith(match[1].toLowerCase()));
                        setEmojiName(emoji?.key || "");
                        return;
                    }
                }

                setEmojiTarget(null);
            }

            setMentionTarget(null);
            setEmojiTarget(null);
        }}>
            {!readOnly && mentionTarget && mentionUsers.length > 0 && (
                <div ref={mentionRef} className={styles.typingListContainer}>
                    {mentionUsers.map((user) => (
                        <div
                            key={user.id}
                            className={styles.typingListItem}
                            onClick={() => {
                                Transforms.select(editor, mentionTarget);
                                insertMention(editor, user);
                                Transforms.insertText(editor, " ");
                                setMentionTarget(null);
                            }}
                            data-selected={user.id === mentionUserId}
                        >
                            <div className={styles.typingListItemImage}>
                                <Blook
                                    src={getUserAvatarPath(user)}
                                    shiny={user.avatar?.shiny}
                                    draggable={false}
                                />
                            </div>

                            <Username user={user} />
                        </div>
                    ))}
                </div>
            )}

            {!readOnly && emojiTarget && emojis.length > 0 && (
                <div ref={emojiRef} className={styles.typingListContainer}>
                    {emojis.map((emoji) => (
                        <div
                            key={emoji.key}
                            className={styles.typingListItem}
                            onClick={() => {
                                Transforms.select(editor, emojiTarget);
                                insertEmoji(editor, emoji.value);
                                setEmojiTarget(null);
                            }}
                            data-selected={emoji.key === emojiName}
                        >
                            <Twemoji options={{ className: styles.typingListItemImage }}>
                                {emoji.value}
                            </Twemoji>

                            <div>{emoji.key}</div>
                        </div>
                    ))}
                </div>
            )}
            <Editable renderElement={renderElement} renderLeaf={renderLeaf} decorate={decorate} readOnly={readOnly} contentEditable={readOnly ? undefined : true} style={{ color: color && color }} {...props}
                onKeyDown={(e) => {
                    if (mentionRef.current && mentionUsers.length > 0) {
                        switch (e.key) {
                            case "ArrowDown":
                                e.preventDefault();
                                setMentionUserId(mentionUsers[mentionUsers.findIndex((user) => user.id === mentionUserId) + 1]?.id || mentionUsers[0].id);

                                break;
                            case "ArrowUp":
                                e.preventDefault();
                                const index = mentionUsers.findIndex((user) => user.id === mentionUserId) - 1;

                                setMentionUserId(mentionUsers[index < 0 ? mentionUsers.length - 1 : index].id);

                                break;
                            case "Tab":
                            case "Enter":
                                if (!mentionTarget) return;

                                e.preventDefault();
                                Transforms.select(editor, mentionTarget);

                                const mentionUser = mentionUsers.find((user) => user.id === mentionUserId);
                                if (mentionUser) insertMention(editor, mentionUser);

                                Transforms.insertText(editor, " ");

                                setMentionTarget(null);

                                break;
                            case "Escape":
                                e.preventDefault();
                                setMentionTarget(null);

                                break;
                        }
                    } else if (emojiRef.current && emojis.length > 0) {
                        switch (e.key) {
                            case "ArrowDown":
                                e.preventDefault();
                                setEmojiName(emojis[emojis.findIndex((emoji) => emoji.key === emojiName) + 1]?.key || emojis[0].key);

                                break;
                            case "ArrowUp":
                                e.preventDefault();
                                const index = emojis.findIndex((emoji) => emoji.key === emojiName) - 1;

                                setEmojiName(emojis[index < 0 ? emojis.length - 1 : index].key);

                                break;
                            case "Tab":
                            case "Enter":
                                if (!emojiTarget) return;

                                e.preventDefault();
                                Transforms.select(editor, emojiTarget);

                                const emoji = emojis.find((emoji) => emoji.key === emojiName);
                                if (emoji) insertEmoji(editor, emoji.value);

                                setEmojiTarget(null);

                                break;
                            case "Escape":
                                e.preventDefault();
                                setEmojiTarget(null);

                                break;
                        }
                    } else if (props.onKeyDown) props.onKeyDown(e);
                }}
            />
        </Slate>
    );
}
