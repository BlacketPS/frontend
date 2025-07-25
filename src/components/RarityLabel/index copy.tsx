import { useRef, useLayoutEffect, useState } from "react";

function getOverlayFill(hex: string): string {
    if (!hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) {
        return "rgba(0, 0, 0, 0.4)";
    }

    if (hex.length === 4) {
        hex = "#" + [...hex.slice(1)].map((c) => c + c).join("");
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance < 128
        ? "rgba(255, 255, 255, 0.4)"
        : "rgba(0, 0, 0, 0.4)";
}

export default function RarityLabel({
    text = "LEGENDARY",
    backgroundColor = "#f7a600",
    width = "100%",
    height = "100%"
}: {
    text?: string;
    backgroundColor?: string;
    width?: string;
    height?: string;
}) {
    const [textWidth, setTextWidth] = useState(0);
    const textRef = useRef<SVGTextElement>(null);

    const maskId = `mask-${text}-${Math.random().toString(36).slice(2)}`;
    const useRainbow = backgroundColor === "rainbow";

    useLayoutEffect(() => {
        if (!textRef.current) return;

        const bbox = textRef.current.getBBox();

        setTextWidth(bbox.width);
    }, [text]);

    const unitHeight = 50;

    const px = unitHeight * 0.7;
    const actualFontSize = unitHeight * 0.7;

    const badgeHeight = unitHeight;
    const badgeWidth = textWidth + px * 2;
    const borderRadius = badgeHeight / 2;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${badgeWidth} ${badgeHeight}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <mask id={maskId}>
                    <rect
                        width={badgeWidth}
                        height={badgeHeight}
                        rx={borderRadius}
                        ry={borderRadius}
                        fill="white"
                    />

                    <text
                        ref={textRef}
                        x={badgeWidth / 2}
                        y={badgeHeight / 2 + 3}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={actualFontSize}
                        fontFamily={"'Titan One', sans-serif"}
                        fill="black"
                        style={{ textTransform: "uppercase" }}
                    >
                        {text}
                    </text>
                </mask>

                {useRainbow && (<>
                    <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="red" />
                        <stop offset="14.28%" stopColor="orange" />
                        <stop offset="28.56%" stopColor="yellow" />
                        <stop offset="42.84%" stopColor="#0f0" />
                        <stop offset="57.12%" stopColor="#0ff" />
                        <stop offset="71.4%" stopColor="blue" />
                        <stop offset="85.68%" stopColor="#f0f" />
                        <stop offset="100%" stopColor="red" />
                    </linearGradient>

                    <pattern
                        id="rainbowPattern"
                        patternUnits="userSpaceOnUse"
                        width="400"
                        height="50"
                    >
                        <rect width="400" height="50" fill="url(#rainbowGradient)" />

                        <animateTransform
                            attributeName="patternTransform"
                            type="translate"
                            from="0 0"
                            to="400 0"
                            dur="3s"
                            repeatCount="indefinite"
                            calcMode="linear"
                        />
                    </pattern>
                </>)}
            </defs>

            <rect
                width={badgeWidth}
                height={badgeHeight}
                rx={borderRadius}
                ry={borderRadius}
                fill={getOverlayFill(backgroundColor)}
            />

            <rect
                width={badgeWidth}
                height={badgeHeight}
                rx={borderRadius}
                ry={borderRadius}
                fill={useRainbow ? "url(#rainbowPattern)" : backgroundColor}
                stroke={"rgba(0, 0, 0, 0.4)"}
                strokeWidth={4}
                mask={`url(#${maskId})`}
            />
        </svg>
    );
}
