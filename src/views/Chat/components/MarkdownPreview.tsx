// this file has no types and is really messy because it's awful to deal with
// if anyone wants to make types for it you're welcome to

// TODO: clean this up and make it more readable, add types, and fix any issues after release

import { useCallback, useMemo, useRef, useState } from "react";
import Prism, { Token } from "prismjs";
import "prismjs/components/prism-markdown";
import { Editor, Node, Path, Text, Transforms, Range, createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { ImageOrVideo, Username } from "@components/index";
import AreYouSureLinkModal from "./AreYouSureLinkModal";
import Twemoji from "react-twemoji";
import styles from "../chat.module.scss";

import { MarkdownPreviewProps, ElementProps } from "../chat";
import { PublicUser } from "@blacket/types";
import { useNavigate } from "react-router-dom";

Prism.languages.blacketMarkdown = {
    // colorBoldItalic: { pattern: /{#([0-9a-fA-F]{6})}\*\*\*([^*]+)\*\*\*{#([0-9a-fA-F]{6})}/g },
    // colorBold: { pattern: /{#([0-9a-fA-F]{6})}\*\*([^*]+)\*\*{#([0-9a-fA-F]{6})}/g },
    // colorItalic: { pattern: /{#([0-9a-fA-F]{6})}\*([^*]+)\*{#([0-9a-fA-F]{6})}/g },
    // colorStrikethrough: { pattern: /{#([0-9a-fA-F]{6})}~~([^~]+)~~{#([0-9a-fA-F]{6})}/g },
    // colorUnderlined: { pattern: /{#([0-9a-fA-F]{6})}__([^_]+)__{#([0-9a-fA-F]{6})}/g },
    // color: { pattern: /{#([0-9a-fA-F]{6})}([^{]+){#([0-9a-fA-F]{6})}/g },
    boldItalic: { pattern: /\*\*\*([^*]+)\*\*\*/g },
    bold: { pattern: /\*\*([^*]+)\*\*/g },
    italic: { pattern: /\*([^*]+)\*/g },
    strikethrough: { pattern: /~~([^~]+)~~/g },
    underlined: { pattern: /__([^_]+)__/g },
    code: { pattern: /`([^`]+)`/g },
    link: { pattern: /https?:\/\/([^\s]+)/g },
    mention: { pattern: /<@(\d+)>/g }
};

const withMentions = (editor: any) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element: any) => {
        return element.type === "mention" ? true : isInline(element);
    };

    editor.isVoid = (element: any) => {
        return element.type === "mention" ? true : isVoid(element);
    };

    editor.markableVoid = (element: any) => {
        return element.type === "mention" || markableVoid(element);
    };

    return editor;
};

const insertMention = (editor: any, user: PublicUser) => {
    const mention = {
        type: "mention",
        user,
        children: [{ text: "" }]
    };

    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};

const insertEmoji = (editor: any, emoji: string) => {
    const text = { text: emoji };
    Transforms.insertNodes(editor, text);
};

const Mention = ({ attributes, children, element }: ElementProps) => {
    return (
        <span
            {...attributes}
            contentEditable={false}
            className="mention"
        >
            @{element.user.username}
            {children}
        </span>
    );
};

const Element = ({ attributes, children, element }: ElementProps) => {
    switch (element.type) {
        case "mention":
            return <Mention {...{ attributes, children, element }} />;
        default:
            return <span {...attributes}>{children}</span>;
    }
};

export default function MarkdownPreview({ content, color, readOnly, getEditor = () => { }, ...props }: MarkdownPreviewProps) {
    const { createModal } = useModal();
    const { getUserAvatarPath } = useUser();
    const { cachedUsers } = useCachedUser();

    const navigate = useNavigate();

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

    const editor = useMemo(() => withMentions(withReact(createEditor())), []);

    getEditor(editor);

    const Leaf = ({ attributes, children, leaf }: any) => {
        switch (true) {
            case leaf.code:
                return <span {...attributes} className={readOnly ? "codeDark" : "code"}>{readOnly ? leaf.content : children}</span>;
            case leaf.link:
                return <a {...attributes} className="link" href={leaf.content} onClick={(e) => {
                    e.preventDefault();

                    createModal(<AreYouSureLinkModal link={leaf.content} />);
                }}>{readOnly ? leaf.content : children}</a>;
            // case leaf.color:
            //     return <span {...attributes} className={`
            //             ${(leaf.colorBold || leaf.colorBoldItalic) ? "bold" : ""}
            //             ${(leaf.colorItalic || leaf.colorBoldItalic) ? "italic" : ""}
            //             ${leaf.colorStrikethrough ? "strikethrough" : ""}
            //             ${leaf.colorUnderlined ? "underline" : ""}
            //         `} style={{ color: leaf.hexcode }}>{readOnly ? leaf.content : children}</span>;
            case leaf.mention:
                const user = cachedUsers.find((user) => user.id === leaf.content.replace(/<@|>/g, ""))?.username;

                if (readOnly) return <span {...attributes} contentEditable={false} className="mention" onClick={() => {
                    if (user) navigate(`/dashboard?name=${user}`);
                }} style={{ cursor: "pointer" }}>{user ? `@${user}` : leaf.content}</span>;
                else return <span {...attributes} className="mention">{children}</span>;
            default:
                return <span {...attributes} className={`
                        ${(leaf.bold || leaf.boldItalic) ? "bold" : ""}
                        ${(leaf.italic || leaf.boldItalic) ? "italic" : ""}
                        ${leaf.strikethrough ? "strikethrough" : ""}
                        ${leaf.underlined ? "underline" : ""}
                    `}>{readOnly ? leaf.content ?? children : children}</span>;
        }
    };

    const decorate = useCallback(([node, path]: [Node, Path]) => {
        const ranges: any[] = [];

        if (!Text.isText(node)) return ranges;

        const getLength = (token: string | { content: string | Token[] }): number => {
            if (typeof token === "string") return token.length;
            else if (typeof token.content === "string") return token.content.length;
            else return (token.content).reduce((length, token: any) => length + getLength(token), 0);
        };

        const tokens: any = Prism.tokenize(node.text, Prism.languages.blacketMarkdown);

        let start = 0;

        for (const token of tokens) {
            const length = getLength(token);

            const end = start + length;

            if (typeof token !== "string") {
                switch (token.type) {
                    case "boldItalic":
                    case "bold":
                    case "italic":
                    case "strikethrough":
                    case "underlined":
                        ranges.push({
                            [token.type]: true,
                            content: node.text.slice(start, end).replace(token.type === "boldItalic" ? /\*\*\*|\*\*\*/g : token.type === "bold" ? /\*\*|\*\*/g : token.type === "italic" ? /\*|\*/g : token.type === "strikethrough" ? /~~|~~/g : /__|__/g, ""),
                            anchor: { path, offset: start },
                            focus: { path, offset: end }
                        });
                        break;
                    case "code":
                        ranges.push({
                            code: true,
                            content: node.text.slice(start, end).replace(/`|`/g, ""),
                            anchor: { path, offset: start },
                            focus: { path, offset: end }
                        });
                        break;
                    case "link":
                        ranges.push({
                            link: true,
                            content: node.text.slice(start, end),
                            anchor: { path, offset: start },
                            focus: { path, offset: end }
                        });
                        break;
                    // case "colorBoldItalic":
                    //     ranges.push({
                    //         color: true,
                    //         colorBoldItalic: true,
                    //         hexcode: token.content[1] + token.content[2] + token.content[3] + token.content[4] + token.content[5] + token.content[6] + token.content[7],
                    //         content: node.text.slice(start, end).replace(/{#([0 - 9a - fA - F]{ 6})}\*\*\*|\*\*\*{#([0 - 9a - fA - F]{ 6})}/g, ""),
                    //         anchor: { path, offset: start },
                    //         focus: { path, offset: end }
                    //     });
                    //     break;
                    // case "colorBold":
                    //     ranges.push({
                    //         color: true,
                    //         colorBold: true,
                    //         hexcode: token.content[1] + token.content[2] + token.content[3] + token.content[4] + token.content[5] + token.content[6] + token.content[7],
                    //         content: node.text.slice(start, end).replace(/{#([0 - 9a - fA - F]{ 6})}\*\*|\*\*{#([0 - 9a - fA - F]{ 6})}/g, ""),
                    //         anchor: { path, offset: start },
                    //         focus: { path, offset: end }
                    //     });
                    //     break;
                    // case "colorItalic":
                    //     ranges.push({
                    //         color: true,
                    //         colorItalic: true,
                    //         hexcode: token.content[1] + token.content[2] + token.content[3] + token.content[4] + token.content[5] + token.content[6] + token.content[7],
                    //         content: node.text.slice(start, end).replace(/{#([0 - 9a - fA - F]{ 6})}\*|\*{#([0 - 9a - fA - F]{ 6})}/g, ""),
                    //         anchor: { path, offset: start },
                    //         focus: { path, offset: end }
                    //     });
                    //     break;
                    // case "colorStrikethrough":
                    //     ranges.push({
                    //         color: true,
                    //         colorStrikethrough: true,
                    //         hexcode: token.content[1] + token.content[2] + token.content[3] + token.content[4] + token.content[5] + token.content[6] + token.content[7],
                    //         content: node.text.slice(start, end).replace(/{#([0 - 9a - fA - F]{ 6})}~~|~~{#([0 - 9a - fA - F]{ 6})}/g, ""),
                    //         anchor: { path, offset: start },
                    //         focus: { path, offset: end }
                    //     });
                    //     break;
                    // case "colorUnderlined":
                    //     ranges.push({
                    //         color: true,
                    //         colorUnderlined: true,
                    //         hexcode: token.content[1] + token.content[2] + token.content[3] + token.content[4] + token.content[5] + token.content[6] + token.content[7],
                    //         content: node.text.slice(start, end).replace(/{#([0 - 9a - fA - F]{ 6})}__|__{#([0 - 9a - fA - F]{ 6})}/g, ""),
                    //         anchor: { path, offset: start },
                    //         focus: { path, offset: end }
                    //     });
                    //     break;
                    // case "color":
                    //     ranges.push({
                    //         color: true,
                    //         hexcode: token.content[1] + token.content[2] + token.content[3] + token.content[4] + token.content[5] + token.content[6] + token.content[7],
                    //         content: node.text.slice(start, end).replace(/{#([0 - 9a - fA - F]{ 6})}|{#([0 - 9a - fA - F]{ 6})}/g, ""),
                    //         anchor: { path, offset: start },
                    //         focus: { path, offset: end }
                    //     });
                    //     break;
                    case "mention":
                        ranges.push({
                            mention: true,
                            content: node.text.slice(start, end).replace(/<>/g, ""),
                            anchor: { path, offset: start },
                            focus: { path, offset: end }
                        });
                        break;
                }
            }

            start = end;
        }

        return ranges;
    }, []);

    const initialValue = content ? content.toString().split("\n").map((text: string) => ({ type: "paragraph", children: [{ text }] })) : [{ type: "paragraph", children: [{ text: "" }] }];

    const renderElement = useCallback((props: any) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

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

            // i know this is a shit workaround but it works, you can clean it up and do this better if you want - zastix
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
                                <ImageOrVideo src={getUserAvatarPath(user)} />
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
                    } else {
                        props.onKeyDown(e);
                    }
                }}
            />
        </Slate>
    );
}
