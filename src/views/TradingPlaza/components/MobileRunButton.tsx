import { useEffect, useRef, useState } from "react";
import styles from "../tradingPlaza.module.scss";

import { MobileRunButtonProps } from "../tradingPlaza.d";

export default function MobileRunButton({ onPress, onRelease }: MobileRunButtonProps) {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const baseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

        const base = baseRef.current;
        if (!base) return;

        const handleTouchStart = () => {
            setIsRunning(true);
            if (onPress) onPress();
        };

        const handleTouchEnd = () => {
            setIsRunning(false);
            if (onRelease) onRelease();
        };

        base.addEventListener("touchstart", handleTouchStart);
        base.addEventListener("touchend", handleTouchEnd);

        return () => {
            base.removeEventListener("touchstart", handleTouchStart);
            base.removeEventListener("touchend", handleTouchEnd);
        };
    }, [onPress, onRelease]);

    if (!isTouchDevice) return null;

    return (
        <div
            ref={baseRef}
            className={styles.mRunButtonBase}
            style={{
                backgroundColor: isRunning ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"
            }}
        >
            <i className="fas fa-person-running" />
        </div>
    );
}
