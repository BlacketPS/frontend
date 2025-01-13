import { useData } from "@stores/DataStore/index";

import { UsernameProps } from "./username.d";

export default function Username({ user, className, style = {}, ...props }: UsernameProps) {
    const { fontIdToName } = useData();

    if (!user) return null;
    if (!user.color) return null;

    let gradientStyle = {};
    if (user.color.includes("|")) {
        const [degrees, colors] = user.color.split("|");
        const colorArray = colors.split(",").map((color) => {
            const [hex, stop] = color.split("@");
            return stop ? `${hex} ${stop}%` : hex;
        });

        gradientStyle = {
            background: `linear-gradient(${degrees}deg, ${colorArray.join(", ")}) text`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
        };
    }

    return <span
        className={`
            ${className ? `${className}` : ""}
            ${user.color === "rainbow" ? "rainbow" : ""}
        `}
        style={{
            color: user.color,
            fontFamily: fontIdToName(user.fontId!),
            ...style,
            ...gradientStyle
        }}
        {...props}
    >
        {user.username}
    </span>;
}
