import { useRef, useEffect, useState } from "react";

function getOverlayFill(hex: string): string {
    if (!hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) {
        return "rgba(0, 0, 0, 0.8)";
    }

    if (hex.length === 4) {
        hex = "#" + [...hex.slice(1)].map((c) => c + c).join("");
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance < 128
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(0, 0, 0, 0.5)";
}

export default function RarityLabel({
    text,
    backgroundColor
}: {
    text: string;
    backgroundColor: string;
}) {
    const textRef = useRef<SVGTextElement>(null);
    const [finalWidth, setFinalWidth] = useState<number | null>(null);

    const maskId = `mask-${text}-${Math.random().toString(36).slice(2)}`;
    const useRainbow = backgroundColor === "rainbow";
    const useShiny = backgroundColor === "shiny";

    const unitHeight = 50;
    const fontSize = unitHeight * 0.8;
    const paddingY = unitHeight * 0.1;
    const paddingRatio = 0.2;

    useEffect(() => {
        if (!textRef.current) return;

        const updateSize = () => {
            const bbox = textRef.current!.getBBox();
            const rawTextWidth = bbox.width;
            const totalPadding = rawTextWidth * paddingRatio * 2;
            const fullWidth = rawTextWidth + totalPadding;

            setFinalWidth(fullWidth);
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(textRef.current);

        return () => observer.disconnect();
    }, [text]);

    const badgeWidth = finalWidth || 200;
    const badgeHeight = unitHeight + paddingY * 2;
    const borderRadius = badgeHeight / 2;

    return (
        <>
            <svg
                width={0}
                height={0}
                style={{ position: "absolute", visibility: "hidden", pointerEvents: "none" }}
            >
                <text
                    ref={textRef}
                    fontSize={fontSize}
                    fontFamily="'Titan One', sans-serif"
                    style={{ textTransform: "uppercase" }}
                >
                    {text}
                </text>
            </svg>

            <svg
                width="100%"
                height="100%"
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
                            x={badgeWidth / 2}
                            y={badgeHeight / 2 + 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={fontSize}
                            fontFamily="'Titan One', sans-serif"
                            fill="black"
                            style={{ textTransform: "uppercase" }}
                        >
                            {text}
                        </text>
                    </mask>

                    {useRainbow && (
                        <>
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
                        </>
                    )}

                    {useShiny && (
                        <>
                            <linearGradient id="shinyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FDE4E4" />
                                <stop offset="25%" stopColor="#C8F3D4" />
                                <stop offset="50%" stopColor="#A7FFE2" />
                                <stop offset="75%" stopColor="#FAFFB2" />
                                <stop offset="100%" stopColor="#FDE4E4" />

                            </linearGradient>

                            <pattern
                                id="shinyPattern"
                                patternUnits="userSpaceOnUse"
                                width="400"
                                height="50"
                            >
                                <rect width="400" height="50" fill="url(#shinyGradient)" />
                                <animateTransform
                                    attributeName="patternTransform"
                                    type="translate"
                                    from="0 0"
                                    to="400 0"
                                    dur="2s"
                                    repeatCount="indefinite"
                                    calcMode="linear"
                                />
                            </pattern>
                        </>
                    )}
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
                    fill={
                        useRainbow
                            ? "url(#rainbowPattern)"
                            : useShiny
                                ? "url(#shinyPattern)"
                                : backgroundColor
                    }
                    stroke="rgba(0, 0, 0, 0.4)"
                    strokeWidth={4}
                    mask={`url(#${maskId})`}
                />
            </svg>
        </>
    );
}
