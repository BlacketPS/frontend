import { useState, useEffect, useRef, FocusEvent, ClipboardEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@components/index";
import styles from "./colorPicker.module.scss";

import { ColorPickerProps } from "./colorPicker.d";

const isMobile = () => window.innerWidth <= 768;

export default function ColorPicker({ initialColor, onPick, children, open, hideInput, style }: ColorPickerProps) {
    const [colorPickerOpen, setColorPickerOpen] = open || useState<boolean>(false);
    const [color, setColor] = initialColor || useState<string>("#ffffff");

    const containerRef = useRef<HTMLDivElement>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        let value = e.target.value;
        while (value.length < 6) value += "0";

        setColor(`#${value}`);
        onPick(`#${value}`);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        let clipboardData = e.clipboardData.getData("text");
        if (clipboardData.startsWith("#")) clipboardData = clipboardData.slice(1);

        if (!clipboardData.match(/^[0-9a-fA-F]{0,6}$/)) return;

        let value = clipboardData;
        while (value.length < 6) value += "0";

        setColor(`#${value}`);
        onPick(`#${value}`);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                colorPickerRef.current
                && !colorPickerRef.current.contains(event.target as Node)
            ) setColorPickerOpen(false);
        }

        if (colorPickerOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [colorPickerOpen]);

    return (
        <>
            {!hideInput && (
                <div ref={containerRef} className={styles.colorSelectorContainer}>
                    <div className={styles.colorSelectorLabel}>{children}</div>
                    <Input
                        value={color.slice(1)}
                        style={{
                            textShadow: "0 0 7px black",
                            backgroundColor: color
                        }}
                        containerProps={{
                            style: {
                                textShadow: "0 0 7px black",
                                backgroundColor: color
                            }
                        }}
                        icon="fas fa-hashtag"
                        onChange={(e) => {
                            if (!e.target.value.match(/^[0-9a-fA-F]{0,6}$/)) return;

                            setColor(`#${e.target.value}`);
                            onPick(`#${e.target.value}`);
                        }}
                        onBlur={handleBlur}
                        onClick={() => setColorPickerOpen(!colorPickerOpen)}
                        onPaste={handlePaste}
                        ref={inputRef}
                    />
                </div>
            )}

            {colorPickerOpen && <div
                className={styles.colorPickerContainer}
                style={{
                    top: !hideInput ? isMobile() ? containerRef.current!.getBoundingClientRect()!.top - 105 : undefined : undefined,
                    marginTop: !hideInput ? !isMobile() ? containerRef.current!.getBoundingClientRect()!.top - 145 : undefined : undefined,
                    ...style
                }}
            >
                <div ref={colorPickerRef} className={styles.colorPicker}>
                    <HexColorPicker
                        color={color}
                        onChange={(newColor) => {
                            setColor(newColor);
                            onPick(newColor);
                        }}
                        style={{
                            zIndex: 10
                        }}
                    />
                </div>
            </div>}
        </>
    );
}
