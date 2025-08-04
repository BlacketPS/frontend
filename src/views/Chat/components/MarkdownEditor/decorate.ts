import { Node, Path, Text } from "slate";
import { MARKDOWN_PATTERNS } from "@constants/markdownPatterns";

import { LeafContent } from "../../chat.d";

function getNonOverlappingMatches(text: string, regex: RegExp, used: boolean[]) {
    const matches: { start: number, end: number, match: RegExpExecArray }[] = [];

    let match;

    while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;

        if (!used.slice(start, end).some(Boolean)) {
            matches.push({ start, end, match });

            for (let i = start; i < end; ++i) used[i] = true;
        }
    }

    return matches;
}

export default function decorate([node, path]: [Node, Path]) {
    const ranges: any[] = [];
    if (!Text.isText(node)) return ranges;

    const text = node.text;
    const used: boolean[] = Array(text.length).fill(false);

    let marks: { start: number, end: number, type: string, content?: LeafContent }[] = [];

    // bolditalic first
    const boldItalicPattern = MARKDOWN_PATTERNS.find((p) => p.type === "bolditalic")!.regex;
    const boldItalicMatches = getNonOverlappingMatches(text, boldItalicPattern, used);

    for (const { start, end, match } of boldItalicMatches) {
        marks.push({ start, end, type: "bold", content: { text: match[1] } });
        marks.push({ start, end, type: "italic", content: { text: match[1] } });
    }

    // bold without bolditalic
    const boldPattern = MARKDOWN_PATTERNS.find((p) => p.type === "bold")!.regex;
    const boldMatches = getNonOverlappingMatches(text, boldPattern, used);

    for (const { start, end, match } of boldMatches) marks.push({ start, end, type: "bold", content: { text: match[1] } });

    // italic without bolditalic or bold
    const italicPattern = MARKDOWN_PATTERNS.find((p) => p.type === "italic")!.regex;
    const italicMatches = getNonOverlappingMatches(text, italicPattern, used);

    for (const { start, end, match } of italicMatches) marks.push({ start, end, type: "italic", content: { text: match[1] } });

    // others
    for (const { type, regex } of MARKDOWN_PATTERNS) {
        if ([
            "bolditalic",
            "bold",
            "italic"
        ].includes(type)) continue;

        let match;

        while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            console.log(match);

            switch (type) {
                case "color":
                    marks.push({
                        start,
                        end,
                        type,
                        content: {
                            text: match[2],
                            color: match[1]
                        }
                    });

                    break;
                default:
                    marks.push({
                        start,
                        end,
                        type,
                        content: {
                            text: match[1] ?? match[0]
                        }
                    });
            }
        }
    }

    // sort and build ranges
    marks = marks.sort((a, b) => a.start - b.start);

    let lastIndex = 0;
    let activeMarks: string[] = [];

    while (lastIndex < text.length) {
        const starting = marks.filter((m) => m.start === lastIndex);

        for (const m of starting) activeMarks.push(m.type);

        let nextIndex = text.length;

        for (const m of marks) {
            if (m.start > lastIndex && m.start < nextIndex) nextIndex = m.start;
            if (m.end > lastIndex && m.end < nextIndex) nextIndex = m.end;
        }

        const ending = marks.filter((m) => m.end === nextIndex);
        const range: any = {
            anchor: { path, offset: lastIndex },
            focus: { path, offset: nextIndex }
        };

        for (const mark of activeMarks) range[mark] = true;

        const matchingMarks = marks.filter((m) => m.start === lastIndex && m.end === nextIndex && m.content !== undefined);
        if (matchingMarks.length > 0) range.content = matchingMarks[matchingMarks.length - 1].content;

        if (nextIndex > lastIndex) ranges.push(range);

        for (const m of ending) activeMarks = activeMarks.filter((t) => t !== m.type);

        lastIndex = nextIndex;
    }

    return ranges;
}
