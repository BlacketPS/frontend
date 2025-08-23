export function parseColor(color: string) {
    let gradientStyle = {};

    if (color.includes("|")) {
        const [degrees, colors] = color.split("|");
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

    return gradientStyle;
}
