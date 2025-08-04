import { MentionElementProps } from "../../../chat.d";

export const Mention = ({ attributes, children, element }: MentionElementProps) => {
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
