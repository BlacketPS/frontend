import { parseColor } from "@functions/blacket/parseColor";
import { useData } from "@stores/DataStore/index";
import styles from "./title.module.scss";

import { TitleProps } from "./title.d";

export default function Title({ title, className, style = {}, ...props }: TitleProps) {
    const { titles, fontIdToName } = useData();

    const t = typeof title === "number" ? titles.find((t) => t.id === title) : title;
    if (!t) return null;

    const gradientStyle = parseColor(t.color);

    return <span
        className={`
            ${className ? `${className} ${styles.title}` : styles.title}
            ${t.color === "rainbow" ? "rainbow" : ""}
        `}
        style={{
            color: t.color,
            fontFamily: fontIdToName(t.fontId!),
            fontWeight: t.bold ? "bold" : "normal",
            fontStyle: t.italic ? "italic" : "normal",
            textDecoration: t.underline ? "underline" : "none",
            ...style,
            ...gradientStyle
        }}
        {...props}
    >
        {t.name}
    </span>;
}
