import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useModal } from "@stores/ModalStore/index";
import AreYouSureLinkModal from "../AreYouSureLinkModal";

import { LeafProps } from "../../chat.d";

const stripMarkdown = (text: string) => {
    return text
        .replace(/[*_~`]/g, "");
};

export default function Leaf({ attributes, children, leaf, readOnly }: LeafProps) {
    const { addCachedUser } = useCachedUser();
    const { createModal } = useModal();

    const navigate = useNavigate();

    const style: CSSProperties = {};

    let cleanChildren = children;
    if (readOnly) {
        if (leaf.content) cleanChildren = stripMarkdown(leaf.content.text);
        else if (typeof leaf.text === "string") cleanChildren = stripMarkdown(leaf.text);
    }

    const [mentionUsername, setMentionUsername] = useState<string>(`<@${cleanChildren}>`);

    useEffect(() => {
        if (leaf.mention && leaf.content)
            addCachedUser(leaf.content.text).then((user) => setMentionUsername(user ? `@${user.username}` : `<@${cleanChildren}>`));
    }, []);

    if (leaf.link && leaf.content) {
        if (readOnly) return <a {...attributes} href={leaf.content.text} target="_blank" rel="noopener noreferrer" onClick={(e) => {
            e.preventDefault();

            createModal(<AreYouSureLinkModal link={leaf.content!.text} />);
        }}>{cleanChildren}</a>;

        return <a {...attributes} href={leaf.content.text} target="_blank" rel="noopener noreferrer">{cleanChildren}</a>;
    }

    if (leaf.mention && leaf.content) {
        if (readOnly) return <span {...attributes} data-mention className="mention" onClick={() => navigate(`/user/${leaf.content!.text}`)}>{mentionUsername}</span>;

        return <span {...attributes} className="mention">{cleanChildren}</span>;
    }

    if (leaf.bold) style.fontWeight = "bold";
    if (leaf.italic) style.fontStyle = "italic";
    if (leaf.strikethrough) style.textDecoration = style.textDecoration ? style.textDecoration + " line-through" : "line-through";
    if (leaf.underlined) style.textDecoration = style.textDecoration ? style.textDecoration + " underline" : "underline";
    if (leaf.color) style.color = leaf.content!.color!;

    return (
        <span {...attributes} style={style}>
            {cleanChildren}
        </span>
    );
}
