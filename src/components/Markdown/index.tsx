import { ReactNode } from "react";
import { Username } from "@components/index";

import { MarkdownProps } from "./markdown.d";

export default function Markdown({ user, children }: MarkdownProps) {
    const parts = children.split(
        /(<\/?#?\w+>|\\n|\{username\}|\*{1,3}|__|~~|`|\[img\s+url\]\(.*?\))/g
    );
    const elements: ReactNode[] = [];

    let color = "";
    let isItalic = false;
    let isBold = false;
    let isUnderline = false;
    let isStrikethrough = false;
    let isCode = false;

    parts.forEach((part, index) => {
        switch (true) {
            case part.startsWith("<") && part.endsWith(">"):
                if (part.startsWith("</")) color = "";
                else color = part.slice(1, -1);

                break;
            case part === "\\n":
                elements.push(<br key={index} />);

                break;
            case part === "{username}":
                elements.push(<span key={index} style={{ color: color || "inherit" }}>
                    <Username user={user} />
                </span>);

                break;
            case part === "*":
                isItalic = !isItalic;
                break;
            case part === "**":
                isBold = !isBold;
                break;
            case part === "***":
                isItalic = !isItalic;
                isBold = !isBold;
                break;
            case part === "__":
                isUnderline = !isUnderline;
                break;
            case part === "~~":
                isStrikethrough = !isStrikethrough;
                break;
            case part === "`":
                isCode = !isCode;
                break;
            case part.startsWith("[img url](") && part.endsWith(")"):
                const url = part.slice(10, -1);

                elements.push(
                    <img key={index} src={url} alt="Image" />
                );
                break;
            default:
                elements.push(
                    <span
                        key={index}
                        style={{
                            color: color || "inherit",
                            fontStyle: isItalic ? "italic" : "normal",
                            fontWeight: isBold ? "bold" : "normal",
                            textDecoration: isUnderline ? "underline" : isStrikethrough ? "line-through" : "none",
                            fontFamily: isCode ? "monospace" : "inherit"
                        }}
                    >
                        {part}
                    </span>
                );

                break;
        }
    });

    return elements;
}
