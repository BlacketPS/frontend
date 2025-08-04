import { Transforms } from "slate";

export const insertEmoji = (editor: any, emoji: string) => {
    const text = { text: emoji };

    Transforms.insertNodes(editor, text);
};
