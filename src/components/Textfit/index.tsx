import { useState, useRef, useEffect, CSSProperties } from "react";

import { TextfitProps } from "./textfit.d";

export default function Textfit({ min = 1, max = 72, mode = "multi", children, className, style }: TextfitProps) {
    const [fontSize, setFontSize] = useState<number>(0);
    const [step, setStep] = useState<number>(1);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const textRef = useRef<HTMLDivElement | null>(null);

    const minRef = useRef<number>(min);
    const maxRef = useRef<number>(max);

    const getElementHeight = (element: HTMLElement | null): number => {
        if (!element) return 0;

        const styles = window.getComputedStyle(element);

        return (
            element.clientHeight -
            parseInt(styles.getPropertyValue("padding-top"), 10) -
            parseInt(styles.getPropertyValue("padding-bottom"), 10)
        );
    };

    const getElementWidth = (element: HTMLElement | null): number => {
        if (!element) return 0;

        const styles = window.getComputedStyle(element);

        return (
            element.clientWidth -
            parseInt(styles.getPropertyValue("padding-left"), 10) -
            parseInt(styles.getPropertyValue("padding-right"), 10)
        );
    };

    const isWidthFit = (element: HTMLElement | null, width: number): boolean => element ? element.scrollWidth - 1 <= width : false;
    const isHeightFit = (element: HTMLElement | null, height: number): boolean => element ? element.scrollHeight - 1 <= height : false;

    useEffect(() => {
        const resizeText = () => {
            const container = containerRef.current;
            if (!container) return;

            const height = getElementHeight(container);
            const width = getElementWidth(container);

            if (height <= 0 || width <= 0) return;

            minRef.current = min;
            maxRef.current = max;

            const initialFontSize = (min + max) / 2;

            setStep(1);
            setFontSize(initialFontSize);
        };

        window.addEventListener("resize", resizeText);
        resizeText();

        return () => window.removeEventListener("resize", resizeText);
    }, [min, max]);

    useEffect(() => {
        const fitText = () => {
            const textElement = textRef.current;
            if (!textElement) return;

            const checkFit =
                mode === "multi"
                    ? () => isHeightFit(textElement, getElementHeight(containerRef.current))
                    : () => isWidthFit(textElement, getElementWidth(containerRef.current));

            const fallbackCheck =
                mode === "multi"
                    ? () => isWidthFit(textElement, getElementWidth(containerRef.current))
                    : () => isHeightFit(textElement, getElementHeight(containerRef.current));

            if (step === 1 && minRef.current <= maxRef.current) {
                checkFit()
                    ? (minRef.current = fontSize + 1)
                    : (maxRef.current = fontSize - 1);

                setFontSize((minRef.current + maxRef.current) / 2);
            } else if (step === 1) setStep(2);

            if (step === 2 && minRef.current < maxRef.current) {
                fallbackCheck()
                    ? (minRef.current = fontSize + 1)
                    : (maxRef.current = fontSize - 1);

                setFontSize((minRef.current + maxRef.current) / 2);
            } else if (step === 2) setStep(3);

            if (step === 3) {
                const adjustedFontSize = Math.max(
                    min,
                    Math.min(max, Math.min(minRef.current, maxRef.current))
                );
                setFontSize(adjustedFontSize);
                setStep(4);
            }
        };

        fitText();
    }, [fontSize, step, mode, min, max]);

    const textStyle: CSSProperties = {
        fontSize,
        opacity: step === 4 ? 1 : 0,
        whiteSpace: mode === "single" ? "nowrap" : "normal"
    };

    return (
        <div ref={containerRef} className={className} style={style}>
            <div ref={textRef} style={textStyle}>
                {children}
            </div>
        </div>
    );
}
