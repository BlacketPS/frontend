import { Transforms } from "slate";

import { PublicUser } from "@blacket/types";

export const insertMention = (editor: any, user: PublicUser) => {
    const mention = {
        type: "mention",
        user,
        children: [{ text: "" }]
    };

    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};
