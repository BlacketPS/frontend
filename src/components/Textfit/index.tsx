import { useState, useRef, useEffect, useLayoutEffect, CSSProperties } from "react";
import { TextfitProps } from "./textfit.d";

export default function Textfit({
    min = 1,
    max = 72,
    mode = "multi",
    children,
    className,
    style
}: TextfitProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState<number>(min);

    const measure = () => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        const containerStyle = getComputedStyle(container);
        const targetWidth =
            container.clientWidth -
            parseFloat(containerStyle.paddingLeft) -
            parseFloat(containerStyle.paddingRight);
        const targetHeight =
            container.clientHeight -
            parseFloat(containerStyle.paddingTop) -
            parseFloat(containerStyle.paddingBottom);

        if (targetWidth <= 0 || targetHeight <= 0) return;

        let low = min;
        let high = max;
        let best = min;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            text.style.fontSize = `${mid}px`;

            const fitsWidth = text.scrollWidth <= targetWidth;
            const fitsHeight = text.scrollHeight <= targetHeight;

            const fits =
                mode === "multi" ? fitsHeight && fitsWidth : fitsWidth && fitsHeight;

            if (fits) {
                best = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        setFontSize(best);
    };

    useLayoutEffect(() => {
        measure();
    }, [min, max, mode, children]);

    useEffect(() => {
        const observer = new ResizeObserver(() => measure());
        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const textStyle: CSSProperties = {
        fontSize,
        whiteSpace: mode === "single" ? "nowrap" : "normal",
        lineHeight: 1
    };

    return (
        <div ref={containerRef} className={className} style={style}>
            <div ref={textRef} style={textStyle}>
                {children}
            </div>
        </div>
    );
}
