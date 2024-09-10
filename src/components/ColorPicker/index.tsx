import { useState, useEffect, useRef, FocusEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@components/index";
import styles from "./colorPicker.module.scss";

import { ColorPickerProps } from "./colorPicker.d";

export default function ColorPicker({ initialColor, onPick, children }: ColorPickerProps) {
    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
    const [color, setColor] = useState<string>(initialColor ?? "#000000");

    const colorPickerRef = useRef<HTMLDivElement>(null);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        let value = e.target.value;
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
            <div className={styles.colorSelectorContainer}>
                <div className={styles.colorSelectorLabel}>{children}</div>
                <Input
                    value={color.slice(1)}
                    style={{
                        textShadow: "0 0 7.5px black",
                        backgroundColor: color
                    }}
                    containerProps={{
                        style: {
                            textShadow: "0 0 7.5px black",
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
                />
            </div>

            {colorPickerOpen && <div className={styles.colorPickerContainer} style={{ transform: `translateY(${window.innerWidth < 650 ? "-195px" : "65px"})` }}>
                <div ref={colorPickerRef} className={styles.colorPicker}>
                    <HexColorPicker color={color} onChange={(newColor) => {
                        setColor(newColor);
                        onPick(newColor);
                    }} />
                </div>
            </div>}
        </>
    );
}
