import { ReactEditor } from "slate-react";

import { ElementType } from "../../../chat.d";

const isCustomElementType = (element: any) => Object.values(ElementType).includes(element.type);

export const withCustomElement = (editor: ReactEditor) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element: any) => {
        return isCustomElementType(element) ? true : isInline(element);
    };

    editor.isVoid = (element: any) => {
        return isCustomElementType(element) ? true : isVoid(element);
    };

    editor.markableVoid = (element: any) => {
        return isCustomElementType(element) || markableVoid(element);
    };

    return editor;
};
